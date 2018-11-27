import mixpanel from 'mixpanel-browser';
import React from 'react';
import { Redirect } from 'react-router-dom';

import actions from '../data/actions';
import Content from '../components/Content';
import Countdown from '../components/Countdown';
import Currency from '../components/Currency';
import Fonts from '../utils/Fonts';
import { getDateAddDays, getPathname } from '../utils/Helpers';
import { Footer, PopupCoins, Row, Searchbar, SortBtn, RadioBtn } from '../components/leaderboard';
import Spinner from '../components/Spinner';

import TXNS_JON_KLAASEN from '../data/txns_jon_klaasen';
import USERS_JON_KLAASEN from '../data/users_jon_klaasen';
import TXNS_MOSTLY_LUCA from '../data/txns_mostly_luca';
import USERS_MOSTLY_LUCA from '../data/users_mostly_luca';
import TXNS_MACKENZIE_SOL from '../data/txns_mostly_luca';
import USERS_MACKENZIE_SOL from '../data/users_mostly_luca';

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
    sortType: DEFAULT_SORT_BY,
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
    console.log('pathname', pathname);
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

  // getPathname = () => {
  //   const { pathname } = this.props.location;
  //   const pathnameFormatted = pathname.replace('/', '').toLowerCase();
  //   return pathnameFormatted;
  // };

  getFans = txns => {
    const { sortType } = this.state;
    const DATA = this.getDATA();
    const txnsReduced = txns.reduce(this.reduceTxns, []).map(fan => {
      const userExisting = DATA.USERS.find(user => user.username === fan.username);
      if (userExisting) {
        return { ...fan, profilePicURL: userExisting.profilePicURL };
      }
      return fan;
    });
    const fanData = this.getSortedFans(txnsReduced, sortType);
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

  getSortedFans = (fans, sortType) => {
    const selectedSort = sortType === 'coins' ? this.sortByCoins : this.sortByGems;
    const fansUpdated = fans.sort(selectedSort).map((fan, index) => ({ ...fan, rank: index + 1 }));
    return fansUpdated;
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

  handleChangeInputSearch = event => this.setState({ inputSearch: event.target.value });

  handleWeekSelect = type => () => this.setState({ weekType: type });

  handleEarnCoins = () => {
    this.setState({ showPopupCoins: true });
  };

  handleEarnGems = () => {
    this.setState({ toStorePoints: true });
  };

  handleSort = () => {
    const { fansCurrent, fansLast, sortType } = this.state;
    const sortTypeUpdated = sortType === 'coins' ? 'gems' : 'coins';
    const fansCurrentUpdated = this.getSortedFans(fansCurrent, sortTypeUpdated);
    const fansLastUpdated = this.getSortedFans(fansLast, sortTypeUpdated);
    this.setState({
      fansCurrent: fansCurrentUpdated,
      fansLast: fansLastUpdated,
      sortType: sortTypeUpdated,
    });
  };

  handlePopupClose = popupName => {
    const key = `showPopup${popupName}`;
    return () => this.setState({ [key]: false });
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
      sortType,
      weekType,
    } = this.state;

    if (toHome) return this.goToHome();
    if (toStorePoints) return this.goToStorePoints();

    const selectedSort = sortType === 'coins' ? this.sortByCoins : this.sortByGems;

    const fans = weekType === 'last' ? fansLast : fansCurrent;

    let leaderboard = null;
    if (fans) {
      leaderboard = isLoading ? (
        <div>
          <Content.Spacing />
          <Content.Spacing />
          <Spinner />
        </div>
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
              type={sortType}
              username={fan.username}
            />
          ))
      );
    }

    const dateUpdateNext = getDateAddDays(influencer.dateUpdateLast, 7);

    let countdownTxt = null;
    if (influencer.dateUpdateLast > 0) {
      countdownTxt =
        weekType === 'current' ? (
          <Content.Row justifyCenter>
            <Countdown date={dateUpdateNext} small />
            <Fonts.P>until</Fonts.P>
            <Content.Gap />
            <Currency.CoinsSingle tiny />
            <Content.Gap />
            <Fonts.P>awarded</Fonts.P>
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

    const sortIcon =
      sortType === 'coins' ? <Currency.CoinsSingle tiny /> : <Currency.GemsSingle tiny />;

    return (
      <div>
        <Content>
          <Fonts.H1 centered noMarginBottom>
            Weekly {influencer.fandom} Leaderboard
          </Fonts.H1>
          <Content.Spacing8px />
          <RadioBtn
            handleCoins={this.handleWeekSelect('last')}
            handleGems={this.handleWeekSelect('current')}
            type={sortType}
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
            <SortBtn handleSort={this.handleSort} sortSelected={weekType} />
          </Content.Row>
          {leaderboard}
          <Content.Spacing />
          <Content.Spacing />
          <Content.Spacing />
          <Content.Spacing />
        </Content>
        <Footer handleEarnCoins={this.handleEarnCoins} handleEarnGems={this.handleEarnGems} />

        {popupCoins}
      </div>
    );
  }
}

export default Leaderboard;
