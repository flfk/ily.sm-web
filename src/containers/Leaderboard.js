import mixpanel from 'mixpanel-browser';
import React from 'react';
import { Redirect } from 'react-router-dom';

import actions from '../data/actions';
import Content from '../components/Content';
import Countdown from '../components/Countdown';
import Currency from '../components/Currency';
import Fonts from '../utils/Fonts';
import { getDateAddDays } from '../utils/Helpers';
import {
  Footer,
  PopupCoins,
  Row,
  Searchbar,
  SortBtn,
  WeekRadioBtn,
} from '../components/leaderboard';

import TXNS from '../data/txns_jon_klaasen';
import USERS from '../data/users';

const JON_KLAASEN_ID = 'xMSUH5anEZbhDCQIecj0';

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
  };

  componentDidMount() {
    const influencerUsername = this.getInfluencerUsername();
    if (influencerUsername) {
      this.setData();
      mixpanel.track('Visited Leaderboard', { influencer: influencerUsername });
    } else {
      this.setState({ toHome: true });
    }
  }

  fetchInfluencer = async () => {
    const influencerID = this.getInfluencerID();
    const influencer = await actions.fetchDocInfluencerByID(influencerID);
    return influencer;
  };

  fetchTxns = async influencer => {
    const dateMin = getDateAddDays(influencer.dateUpdateLast, -7);
    const txnsFirebase = await actions.fetchDocsTxns(dateMin, influencer.id);
    const txns = txnsFirebase.concat(TXNS).filter(txn => txn.timestamp > dateMin);
    return txns;
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

  getInfluencerUsername = () => {
    const { pathname } = this.props.location;
    const username = pathname.replace('/', '');
    return username;
  };

  getInfluencerID = username => {
    switch (username) {
      case 'jon_klaasen':
        return JON_KLAASEN_ID;
      default:
        return JON_KLAASEN_ID;
    }
  };

  getFans = txns => {
    const { sortType } = this.state;
    const txnsReduced = txns.reduce(this.reduceTxns, []).map(fan => {
      const userExisting = USERS.find(user => user.username === fan.username);
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
    const profile = USERS.find(user => user.username === fan.username);
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

  getInfluencerDisplayName = influencerID => {
    switch (influencerID) {
      case 'jon_klaasen':
        return 'KlaasenNation';
      case 'mackenziesol':
        return 'Mackenzie Sol';
      case 'raeganbeast':
        return 'Raegan Beast';
      case 'andreswilley':
        return 'Andre Swilley';
      default:
        return null;
    }
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
    const influencer = await this.fetchInfluencer();
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
      leaderboard = fans
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
            username={fan.username}
          />
        ));
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
          <WeekRadioBtn
            handleCurrent={this.handleWeekSelect('current')}
            handleLast={this.handleWeekSelect('last')}
            weekType={weekType}
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
            <SortBtn handleSort={this.handleSort} sortSelected={sortIcon} />
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
