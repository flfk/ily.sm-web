import mixpanel from 'mixpanel-browser';
import React from 'react';
import { Redirect } from 'react-router-dom';

import actions from '../data/actions';
import Content from '../components/Content';
import Currency from '../components/Currency';
import Fonts from '../utils/Fonts';
import { Row, Footer, PopupCoins, Searchbar, SortBtn } from '../components/leaderboard';

import TXNS from '../data/txns_jon_klaasen';
import USERS from '../data/users';

const JON_KLAASEN_ID = 'xMSUH5anEZbhDCQIecj0';

const MAX_ROWS = 100;
const DEFAULT_SORT_BY = 'gems';
const TIMESTAMP_CUTOFF_START = 1541559600000;
const TIMESTAMP_CUTOFF_END = 1542811806496;

class Leaderboard extends React.Component {
  state = {
    fans: [],
    fansFiltered: [],
    influencer: {
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
  };

  componentDidMount() {
    const influencerUsername = this.getInfluencerUsername();
    if (influencerUsername) {
      this.setInfluencer();
      this.setLeaderboard();
      mixpanel.track('Visited Leaderboard', { influencer: influencerUsername });
    } else {
      this.setState({ toHome: true });
    }
  }

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

    const txnsReduced = TXNS.concat(txnsFirebase)
      .filter(txn => txn.timestamp > TIMESTAMP_CUTOFF_START && txn.timestamp < TIMESTAMP_CUTOFF_END)
      .reduce(this.reduceTxns, [])
      .map(fan => {
        const user = USERS.find(user => user.username === fan.username);
        if (user) {
          return { ...fan, profilePicURL: user.profilePicURL };
        }
        return fan;
      });

    const fanData = this.getSortedFans(txnsReduced, sortType);

    return fanData;
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

  handleSearch = inputSearch => {
    const { fans } = this.state;
    const fansFiltered = fans.filter(fan => fan.username.includes(inputSearch.toLowerCase()));
    this.setState({ fansFiltered });
  };

  handleSort = () => {
    const { fansFiltered, sortType } = this.state;
    const sortTypeUpdated = sortType === 'coins' ? 'gems' : 'coins';
    const fansUpdated = this.getSortedFans(fansFiltered, sortTypeUpdated);
    this.setState({ fansFiltered: fansUpdated, sortType: sortTypeUpdated });
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
    this.setState({ toStorePoints: true });
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

  setLeaderboard = async () => {
    const fans = await this.getFans();
    if (fans.length > 0) {
      this.setState({ fans, fansFiltered: fans });
    } else {
      this.setState({ toHome: true });
    }
  };

  setInfluencer = async () => {
    const influencerID = this.getInfluencerID();
    const influencer = await actions.fetchDocInfluencerByID(influencerID);
    this.setState({ influencer });
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
      influencer,
      inputSearch,
      toHome,
      toStorePoints,
      showPopupCoins,
      showPopupGems,
      sortType,
    } = this.state;

    if (toHome) return this.goToHome();
    if (toStorePoints) return this.goToStorePoints();

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
      <PopupCoins handleClose={this.handlePopupClose('Coins')} username={influencer.username} />
    ) : null;

    const sortIcon =
      sortType === 'coins' ? <Currency.CoinsSingle small /> : <Currency.GemsSingle small />;

    return (
      <div>
        <Content>
          <Fonts.H1 centered noMarginBottom>
            {influencer.fandom}
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
      </div>
    );
  }
}

export default Leaderboard;
