import mixpanel from 'mixpanel-browser';
import React from 'react';
import { Redirect } from 'react-router-dom';

import Content from '../components/Content';
import Coins from '../components/Coins';
import Fonts from '../utils/Fonts';
import { Row, Footer, PopupCoinsExplainer, Searchbar, SortBtn } from '../components/leaderboard';

// import DATA_LEADERBOARD_JON from '../data/dashboards/fanData-jon_klaasen';
import SCORECARDS from '../data/dashboards/jon_klaasen';

const WEEK_INDEX = 1;
const ROWS_PER_LOAD = 20;

class Leaderboard extends React.Component {
  state = {
    fans: [],
    influencerDisplayName: '',
    influencerID: '',
    inputSearch: '',
    // XX REMOVE TO DASHBOARD
    toDashboard: false,
    toHome: false,
    showPopupCoinsExplainer: true,
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
    // .map(data => {
    //   const scorecards = SCORECARDS.filter(scorecard => scorecard.username === data.username);
    //   const scorecardWithImg = scorecards.find(scorecard => scorecard.profilePicURL !== '');
    //   let profilePicURL = '';
    //   if (scorecardWithImg) {
    //     if (scorecardWithImg.profilePicURL) {
    //       profilePicURL = scorecardWithImg.profilePicURL;
    //     }
    //   }
    //   return { ...data, profilePicURL };
    // });

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
      .filter(fan => fan.username.includes(inputSearch))
      .slice(0, ROWS_PER_LOAD);
    this.setState({ fans: filteredData });
  };

  handleSort = () => {
    console.log('handling sort');
  };

  handleChangeInputSearch = event => {
    const inputSearch = event.target.value;
    this.handleSearch(inputSearch);
    this.setState({ inputSearch: event.target.value });
  };

  handleEarnCoins = () => {
    this.setState({ showPopupCoinsExplainer: true });
  };

  handleEarnGems = () => {
    console.log('handling earn gems');
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
      showPopupCoinsExplainer,
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

    const popupCoinsExplainer = showPopupCoinsExplainer ? (
      <PopupCoinsExplainer
        handleClose={this.handlePopupClose('CoinsExplainer')}
        influencer={influencerID}
      />
    ) : null;

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
            <SortBtn handleSort={this.handleSort} sortSelected={<Coins.Icon small />} />
          </Content.Row>
          {leaderboard}
          <Content.Spacing />
          <Content.Spacing />
          <Content.Spacing />
          <Content.Spacing />
        </Content>
        <Footer handleEarnCoins={this.handleEarnCoins} handleEarnGems={this.handleEarnGems} />

        {popupCoinsExplainer}
      </div>
    );
  }
}

export default Leaderboard;
