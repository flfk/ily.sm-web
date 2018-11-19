import mixpanel from 'mixpanel-browser';
import React from 'react';
import { Redirect } from 'react-router-dom';

import Content from '../components/Content';
import Currency from '../components/Currency';
import Fonts from '../utils/Fonts';
import { Row, Footer, PopupCoins, PopupGems, Searchbar, SortBtn } from '../components/leaderboard';

// import DATA_LEADERBOARD_JON from '../data/dashboards/fanData-jon_klaasen';
import SCORECARDS from '../data/dashboards/jon_klaasen';

const WEEK_INDEX = 1;
const ROWS_PER_LOAD = 20;
const DEFAULT_SORT_BY = 'gems';

class Leaderboard extends React.Component {
  state = {
    fans: [],
    influencerDisplayName: '',
    influencerID: '',
    inputSearch: '',
    // XX REMOVE TO DASHBOARD
    toDashboard: false,
    toHome: false,
    showPopupCoins: false,
    showPopupGems: false,
    sortBy: DEFAULT_SORT_BY,
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

  getFanData = () => {
    const influencerID = this.getInfluencerID();
    const scorecardsWeekly = SCORECARDS.filter(scorecard => scorecard.weekIndex === WEEK_INDEX);
    const dataJonKlaasen = scorecardsWeekly;
    switch (influencerID) {
      case 'jon_klaasen':
        return dataJonKlaasen;
      default:
        return [];
    }
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

  getTrophy = index => {
    switch (true) {
      case index === 0:
        return (
          <span role="img" aria-label="1">
            👑
          </span>
        );
      case index < 10:
        return (
          <span role="img" aria-label="1">
            ⭐
          </span>
        );
      case index < 30:
        return (
          <span role="img" aria-label="1">
            🏅
          </span>
        );
      default:
        return <span />;
    }
  };

  handleSearch = inputSearch => {
    const data = this.getFanData();
    const filteredData = data
      .filter(fan => fan.username.includes(inputSearch.toLowerCase()))
      .slice(0, ROWS_PER_LOAD);
    this.setState({ fans: filteredData });
  };

  handleSort = () => {
    const { sortBy } = this.state;
    if (sortBy === 'coins') {
      this.setState({ sortBy: 'gems' });
    } else {
      this.setState({ sortBy: 'coins' });
    }
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
    const data = this.getFanData().slice(0, ROWS_PER_LOAD);
    if (data.length > 0) {
      this.setState({ fans: data, influencerDisplayName, influencerID });
    } else {
      this.setState({ toHome: true });
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

  render() {
    // XX TODO replace with dynamic retrieval
    const {
      fans,
      influencerDisplayName,
      influencerID,
      inputSearch,
      toDashboard,
      toHome,
      showPopupCoins,
      showPopupGems,
      sortBy,
    } = this.state;

    if (toDashboard) return this.goToDashboard(influencerID);
    if (toHome) return this.goToHome();

    let leaderboard = null;
    if (fans) {
      leaderboard = fans.map((fan, index) => (
        <Row
          key={fan.username}
          points={fan.pointsTotal}
          profilePicURL={fan.profilePicURL}
          rank={fan.rank}
          // trophy={this.getTrophy(index)}
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
      sortBy === 'coins' ? <Currency.CoinsSingle small /> : <Currency.GemsSingle small />;

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
