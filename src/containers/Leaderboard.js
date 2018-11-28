import mixpanel from 'mixpanel-browser';
import React from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import actions from '../data/actions';
import CommentCoinPlaceholder from '../assets/CommentCoinPlaceholder.png';
import Content from '../components/Content';
import Countdown from '../components/Countdown';

import Fonts from '../utils/Fonts';
import { getDateAddDays, getPathname } from '../utils/Helpers';
import { Footer, PopupCoins, Row, Searchbar, SortBtn, RadioBtn } from '../components/leaderboard';
import Spinner from '../components/Spinner';

import TXNS_JON_KLAASEN from '../data/txns_jon_klaasen';
import USERS_JON_KLAASEN from '../data/users_jon_klaasen';

import TXNS_MACKENZIE_SOL from '../data/txns_mackenziesol';
import USERS_MACKENZIE_SOL from '../data/users_mackenziesol';

import TXNS_MOSTLY_LUCA from '../data/txns_mostly_luca';
import USERS_MOSTLY_LUCA from '../data/users_mostly_luca';

import TXNS_RAEGAN_BEAST from '../data/txns_raeganbeast';
import USERS_RAEGAN_BEAST from '../data/users_raeganbeast';

// const JON_KLAASEN_ID = 'xMSUH5anEZbhDCQIecj0';
// const MOSTLY_LUCA_ID = 'DwV35s6UFN6YN3exxeoV';

const MAX_ROWS = 100;
const DEFAULT_SORT_BY = 'gems'; // alternative is coins
const DEFAULT_WEEEK_TYPE = 'current'; // alternative is current

class Leaderboard extends React.Component {
  state = {
    fansCurrent: [],
    fansLast: [],
    influencer: {
      dateUpdateLast: 0,
      displayName: '',
      fandom: '',
      id: '',
      username: '',
    },
    inputSearch: '',
    toHome: false,
    toStorePoints: false,
    showPopupCoins: false,
    currencyType: DEFAULT_SORT_BY,
    weekType: DEFAULT_WEEEK_TYPE,
    isLoading: false,
  };

  componentDidMount() {
    const pathname = getPathname(this.props);
    if (pathname) {
      this.setData();
    } else {
      this.setState({ toHome: true });
    }
  }

  fetchInfluencer = async () => {
    const pathname = getPathname(this.props);
    const influencer = await actions.fetchDocInfluencerByField('pathname', pathname);
    return influencer;
  };

  fetchTxns = async influencer => {
    const DATA = this.getDATA();
    const dateMin = getDateAddDays(influencer.dateUpdateLast, -7);
    const txnsFirebase = await actions.fetchDocsTxns(dateMin, influencer.id);
    const txns = txnsFirebase.concat(DATA.TXNS).filter(txn => txn.timestamp > dateMin);
    return txns;
  };

  getDATA = () => {
    const pathname = getPathname(this.props);
    switch (pathname) {
      case 'jonklaasen':
        return {
          TXNS: TXNS_JON_KLAASEN,
          USERS: USERS_JON_KLAASEN,
        };
      case 'mackenziesol':
        return {
          TXNS: TXNS_MACKENZIE_SOL,
          USERS: USERS_MACKENZIE_SOL,
        };
      case 'mostlyluca':
        return {
          TXNS: TXNS_MOSTLY_LUCA,
          USERS: USERS_MOSTLY_LUCA,
        };
      case 'raeganbeast':
        return {
          TXNS: TXNS_RAEGAN_BEAST,
          USERS: USERS_RAEGAN_BEAST,
        };
      default:
        return {
          TXNS: TXNS_JON_KLAASEN,
          USERS: USERS_JON_KLAASEN,
        };
    }
  };

  getDateRange = (dateUpdateLast, weekType) => {
    if (weekType === 'last') {
      return {
        start: getDateAddDays(dateUpdateLast, -7),
        end: dateUpdateLast,
      };
    }
    return {
      start: dateUpdateLast,
      end: getDateAddDays(dateUpdateLast, 7),
    };
  };

  getFans = txns => {
    const { currencyType } = this.state;
    const DATA = this.getDATA();
    const txnsReduced = txns.reduce(this.reduceTxns, []).map(fan => {
      const userExisting = DATA.USERS.find(user => user.username === fan.username);
      if (userExisting) {
        return { ...fan, profilePicURL: userExisting.profilePicURL };
      }
      return fan;
    });
    const fanData = this.sortFans(txnsReduced, currencyType);
    return fanData;
  };

  getFansPlaceholder = (fansCurrent, fansLast) => {
    const fansCurrentUsernames = fansCurrent.map(fan => fan.username);
    const fansPlaceholder = fansLast
      .filter(fan => !fansCurrentUsernames.includes(fan.username))
      .map(fan => ({ ...fan, pointsComments: 0, pointsPaid: 0 }));
    return fansPlaceholder;
  };

  getFansByWeek = (dateUpdateLast, txns, weekType) => {
    const dateRange = this.getDateRange(dateUpdateLast, weekType);
    const txnsFiltered = txns.filter(
      txn => txn.timestamp >= dateRange.start && txn.timestamp < dateRange.end
    );
    const fans = this.getFans(txnsFiltered);
    return fans;
  };

  getFanWithProfilePicURL = fan => {
    const profile = USERS_JON_KLAASEN.find(user => user.username === fan.username);
    if (profile) {
      return { ...fan, profilePicURL: profile.profilePicURL };
    }
    return fan;
  };

  goToHome = () => (
    <Redirect
      push
      to={{
        pathname: '/home',
      }}
    />
  );

  goToStorePoints = () => {
    const { influencer } = this.state;
    return (
      <Redirect
        push
        to={{
          pathname: '/gems',
          search: `?i=${influencer.id}`,
        }}
      />
    );
  };

  handleCurrencySelect = currency => () => {
    const { fansCurrent, fansLast } = this.state;
    const fansCurrentUpdated = this.sortFans(fansCurrent, currency);
    const fansLastUpdated = this.sortFans(fansLast, currency);
    this.setState({
      fansCurrent: fansCurrentUpdated,
      fansLast: fansLastUpdated,
      currencyType: currency,
    });
  };

  handleChangeInputSearch = event => this.setState({ inputSearch: event.target.value });

  handleEarn = currency => {
    if (currency === 'coins') {
      return () => this.setState({ showPopupCoins: true });
    }
    return () => this.setState({ toStorePoints: true });
  };

  handlePopupClose = popupName => {
    const key = `showPopup${popupName}`;
    return () => this.setState({ [key]: false });
  };

  handleWeekToggle = () => {
    const { weekType } = this.state;
    const weekTypeUpdated = weekType === 'current' ? 'last' : 'current';
    this.setState({ weekType: weekTypeUpdated });
  };

  reduceTxns = (aggr, txn) => {
    const userPrevIndex = aggr.map(fans => fans.username).indexOf(txn.username);
    const { changePointsComments, changePointsPaid } = txn;
    if (changePointsComments + changePointsPaid <= 0) {
      return aggr;
    }
    if (userPrevIndex > -1) {
      const userPrev = aggr[userPrevIndex];
      const userUpdated = this.updateFanPoints(userPrev, changePointsComments, changePointsPaid);
      const fansUpdated = aggr.slice();
      fansUpdated[userPrevIndex] = userUpdated;
      return fansUpdated;
    }
    const userNew = {
      username: txn.username,
      profilePicURL: '',
      pointsComments: changePointsComments,
      pointsPaid: changePointsPaid,
    };

    return [...aggr, userNew];
  };

  setData = async () => {
    this.setState({ isLoading: true });
    const influencer = await this.fetchInfluencer();
    mixpanel.track('Visited Leaderboard', { influencer: influencer.username });
    this.setState({ influencer });
    const txns = await this.fetchTxns(influencer);
    const { dateUpdateLast } = influencer;
    const fansLast = this.getFansByWeek(dateUpdateLast, txns, 'last');
    const fansCurrent = this.getFansByWeek(dateUpdateLast, txns, 'current');
    const fansPlaceholder = this.getFansPlaceholder(fansCurrent, fansLast);
    if (txns.length > 0) {
      this.setState({ fansCurrent: fansCurrent.concat(fansPlaceholder), fansLast });
    } else {
      this.setState({ toHome: true });
    }
    this.setState({ isLoading: false });
  };

  sortByCoins = (fanA, fanB) => {
    if (fanB.pointsComments === fanA.pointsComments) {
      return fanB.pointsPaid - fanA.pointsPaid;
    }
    return fanB.pointsComments - fanA.pointsComments;
  };

  sortByGems = (fanA, fanB) => {
    if (fanB.pointsPaid === fanA.pointsPaid) {
      return fanB.pointsComments - fanA.pointsComments;
    }
    return fanB.pointsPaid - fanA.pointsPaid;
  };

  sortFans = (fans, currency) => {
    const sortSelected = currency === 'coins' ? this.sortByCoins : this.sortByGems;
    const fansUpdated = fans.sort(sortSelected).map((fan, index) => ({ ...fan, rank: index + 1 }));
    return fansUpdated;
  };

  updateFanPoints = (fan, changePointsComments, changePointsPaid) => {
    let { pointsComments, pointsPaid } = fan;
    if (changePointsComments > 0) {
      pointsComments += changePointsComments;
    }
    if (changePointsPaid > 0) {
      pointsPaid += changePointsPaid;
    }
    return {
      ...fan,
      pointsComments,
      pointsPaid,
    };
  };

  render() {
    const {
      fansCurrent,
      fansLast,
      influencer,
      inputSearch,
      isLoading,
      toHome,
      toStorePoints,
      showPopupCoins,
      currencyType,
      weekType,
    } = this.state;

    if (toHome) return this.goToHome();
    if (toStorePoints) return this.goToStorePoints();

    const selectedSort = currencyType === 'coins' ? this.sortByCoins : this.sortByGems;

    const fans = weekType === 'last' ? fansLast : fansCurrent;

    let leaderboard = null;
    if (fans) {
      leaderboard = isLoading ? (
        <Spinner />
      ) : (
        fans
          .filter(fan => fan.username.includes(inputSearch.toLowerCase()))
          .sort(selectedSort)
          .slice(0, MAX_ROWS)
          .map(fan => (
            <Row
              key={fan.username}
              inProgress={weekType === 'current'}
              pointsComments={fan.pointsComments}
              pointsPaid={fan.pointsPaid}
              profilePicURL={fan.profilePicURL}
              rank={fan.rank}
              type={currencyType}
              username={fan.username}
            />
          ))
      );
    }

    if (fans && weekType === 'current' && currencyType === 'coins') {
      leaderboard = (
        <div>
          <Content.Spacing8px />
          <Content.Row justifyEnd>
            <PlaceholderWrapper>
              <img src={CommentCoinPlaceholder} alt="" />
            </PlaceholderWrapper>
          </Content.Row>
        </div>
      );
    }

    const dateUpdateNext = getDateAddDays(influencer.dateUpdateLast, 7);

    let countdownTxt = null;
    if (influencer.dateUpdateLast > 0) {
      countdownTxt =
        weekType === 'current' ? (
          <Content.Row justifyCenter>
            <Countdown date={dateUpdateNext} small />
            <Fonts.P>left</Fonts.P>
          </Content.Row>
        ) : (
          <Fonts.P>Winners Announced</Fonts.P>
        );
    }

    const popupCoins = showPopupCoins ? (
      <PopupCoins
        dateUpdateNext={dateUpdateNext}
        handleClose={this.handlePopupClose('Coins')}
        username={influencer.username}
      />
    ) : null;

    return (
      <div>
        <Content>
          <Fonts.H1 centered noMarginBottom>
            Weekly {influencer.fandom} Leaderboard
          </Fonts.H1>
          <Content.Spacing8px />
          <RadioBtn
            handleCoins={this.handleCurrencySelect('coins')}
            handleGems={this.handleCurrencySelect('gems')}
            type={currencyType}
          />
          <Content.Spacing8px />
          <Content.Row justifyCenter>{countdownTxt}</Content.Row>
          <Content.Spacing16px />
          <Content.Row alignTop>
            <Searchbar
              type="text"
              onChange={this.handleChangeInputSearch}
              placeholder="Search usernames"
              value={inputSearch}
            />
            <SortBtn handleSort={this.handleWeekToggle} sortSelected={weekType} />
          </Content.Row>
          {leaderboard}
          <Content.Spacing />
          <Content.Spacing />
          <Content.Spacing />
          <Content.Spacing />
        </Content>
        <Footer currencyType={currencyType} handleEarn={this.handleEarn(currencyType)} />

        {popupCoins}
      </div>
    );
  }
}

const PlaceholderWrapper = styled.div`
  margin-right: 8px;

  height: 88px;
  width: 296px;

  img {
    height: 100%;
    width: 100%;
  }
`;

export default Leaderboard;
