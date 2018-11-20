import mixpanel from 'mixpanel-browser';
import React from 'react';
import { Redirect } from 'react-router-dom';

import actions from '../data/actions';
import Content from '../components/Content';
import Currency from '../components/Currency';
import Fonts from '../utils/Fonts';
import { Row, Footer, PopupCoins, PopupGems, Searchbar, SortBtn } from '../components/leaderboard';

import TXNS from '../data/txns_jon_klaasen';
import USERS from '../data/users';

const MAX_ROWS = 100;
const DEFAULT_SORT_BY = 'gems';
const TIMESTAMP_CUTOFF = 1541559600000;

class Leaderboard extends React.Component {
  state = {
    fans: [],
    fansFiltered: [],
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

  getFans = async () => {
    const { sortType } = this.state;
    const influencerID = this.getInfluencerID();

    const txnsFirebase = await actions.fetchDocsTxns(influencerID);

    const txnsReduced = TXNS.filter(txn => txn.timestamp > TIMESTAMP_CUTOFF)
      .concat(txnsFirebase)
      .reduce(this.reduceTxns, [])
      .map(fan => {
        const user = USERS.find(user => user.username === fan.username);
        if (user) {
          return { ...fan, profilePicURL: user.profilePicURL };
        }
        return fan;
      });

    const fanData = this.getSortedFans(txnsReduced, sortType);

    switch (influencerID) {
      case 'jon_klaasen':
        return fanData;
      default:
        return [];
    }
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

  handleSearch = inputSearch => {
    // const data = this.getFans();
    const { fans } = this.state;
    const fansFiltered = fans.filter(fan => fan.username.includes(inputSearch.toLowerCase()));
    this.setState({ fansFiltered });
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

  setLeaderboardData = async () => {
    const influencerID = this.getInfluencerID();
    const influencerDisplayName = this.getInfluencerDisplayName(influencerID);
    const fans = await this.getFans();
    if (fans.length > 0) {
      this.setState({ fans, fansFiltered: fans, influencerDisplayName, influencerID });
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

  render() {
    // XX TODO replace with dynamic retrieval
    const {
      fansFiltered,
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
    if (fansFiltered) {
      leaderboard = fansFiltered
        .sort(selectedSort)
        .slice(0, MAX_ROWS)
        .map(fan => (
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
