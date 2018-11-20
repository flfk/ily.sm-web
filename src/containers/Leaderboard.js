import mixpanel from 'mixpanel-browser';
import React from 'react';
import { Redirect } from 'react-router-dom';

import Content from '../components/Content';
import Currency from '../components/Currency';
import Fonts from '../utils/Fonts';
import { Row, Footer, PopupCoins, PopupGems, Searchbar, SortBtn } from '../components/leaderboard';

import TXNS from '../data/txns_jon_klaasen';

const MAX_ROWS = 100;
const DEFAULT_SORT_BY = 'gems';
const TIMESTAMP_CUTOFF = 1541559600000;

const TEST_TXNS = [
  {
    changePointsComments: 420000,
    changePointsPaid: 1000,
    timestamp: 1542078000000,
    username: 'TEST_USER',
  },
  {
    changePointsComments: 1,
    changePointsPaid: 1,
    timestamp: 1542078000000,
    username: 'TEST_USER',
  },
];

class Leaderboard extends React.Component {
  state = {
    fans: [],
    influencerDisplayName: '',
    influencerID: '',
    inputSearch: '',
    toHome: false,
    showPopupCoins: false,
    showPopupGems: false,
    sortType: DEFAULT_SORT_BY,
  };

  componentDidMount() {
    const influencerID = this.getInfluencerID();
    if (influencerID) {
      this.setLeaderboardData();
      mixpanel.track('Visited Leaderboard', { influencerID });
    } else {
      this.setState({ toHome: true });
    }
  }

  getInfluencerID = () => {
    const { pathname } = this.props.location;
    const influencerID = pathname.replace('/', '');
    return influencerID;
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

  getFans = () => {
    const { sortType } = this.state;
    const influencerID = this.getInfluencerID();

    // XX TODO NEED TO GET RID OF TEST TRANSACTION CONCATNATION
    const txnsReduced = TXNS.filter(txn => txn.timestamp > TIMESTAMP_CUTOFF)
      .concat(TEST_TXNS)
      .reduce(this.reduceTxns, []);

    const fanData = this.getSortedFans(txnsReduced, sortType);

    switch (influencerID) {
      case 'jon_klaasen':
        return fanData;
      default:
        return [];
    }
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

  handleSearch = inputSearch => {
    const data = this.getFans();
    const filteredData = data.filter(fan => fan.username.includes(inputSearch.toLowerCase()));
    this.setState({ fans: filteredData });
  };

  handleSort = () => {
    const { fans, sortType } = this.state;
    const sortTypeUpdated = sortType === 'coins' ? 'gems' : 'coins';
    const fansUpdated = this.getSortedFans(fans, sortTypeUpdated);
    this.setState({ fans: fansUpdated, sortType: sortTypeUpdated });
  };

  handleChangeInputSearch = event => {
    const inputSearch = event.target.value;
    this.handleSearch(inputSearch);
    this.setState({ inputSearch: event.target.value });
  };

  handleEarnCoins = () => {
    this.setState({ showPopupCoins: true });
  };

  handleEarnGems = () => {
    this.setState({ showPopupGems: true });
  };

  handlePopupClose = popupName => {
    const key = `showPopup${popupName}`;
    return () => this.setState({ [key]: false });
  };

  setLeaderboardData = () => {
    const influencerID = this.getInfluencerID();
    const influencerDisplayName = this.getInfluencerDisplayName(influencerID);
    const data = this.getFans();
    if (data.length > 0) {
      this.setState({ fans: data, influencerDisplayName, influencerID });
    } else {
      this.setState({ toHome: true });
    }
  };

  render() {
    // XX TODO replace with dynamic retrieval
    const {
      fans,
      influencerDisplayName,
      influencerID,
      inputSearch,
      toHome,
      showPopupCoins,
      showPopupGems,
      sortType,
    } = this.state;

    if (toHome) return this.goToHome();

    const selectedSort = sortType === 'coins' ? this.sortByCoins : this.sortByGems;

    let leaderboard = null;
    if (fans) {
      leaderboard = fans
        .sort(selectedSort)
        .slice(0, MAX_ROWS)
        .map((fan, index) => (
          <Row
            key={fan.username}
            pointsComments={fan.pointsComments}
            pointsPaid={fan.pointsPaid}
            profilePicURL={fan.profilePicURL}
            rank={fan.rank}
            username={fan.username}
          />
        ));
    }

    const popupCoins = showPopupCoins ? (
      <PopupCoins handleClose={this.handlePopupClose('Coins')} influencer={influencerID} />
    ) : null;

    const popupGems = showPopupGems ? (
      <PopupGems handleClose={this.handlePopupClose('Gems')} />
    ) : null;

    const sortIcon =
      sortType === 'coins' ? <Currency.CoinsSingle small /> : <Currency.GemsSingle small />;

    return (
      <div>
        <Content>
          <Fonts.H1 centered noMarginBottom>
            {influencerDisplayName}
            's Weekly Top Supporters
          </Fonts.H1>
          <br />
          <Content.Row>
            <Searchbar
              type="text"
              onChange={this.handleChangeInputSearch}
              placeholder={'Search usernames'}
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
        {popupGems}
      </div>
    );
  }
}

export default Leaderboard;
