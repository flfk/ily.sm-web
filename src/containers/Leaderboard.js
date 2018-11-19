import mixpanel from 'mixpanel-browser';
import React from 'react';
import { Redirect } from 'react-router-dom';

import Content from '../components/Content';
import Fonts from '../utils/Fonts';
import LeaderboardRow from '../components/LeaderboardRow';
import LeaderboardFooter from '../components/LeaderboardFooter';
import Searchbar from '../components/Searchbar';

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
    toDashboard: false,
    toHome: false,
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
        return 'Jon Klaasen';
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
    console.log('handling search');
    const data = this.getFanData();
    const filteredData = data
      .filter(fan => fan.username.includes(inputSearch))
      .slice(0, ROWS_PER_LOAD);
    this.setState({ fans: filteredData });
  };

  handleChangeInputSearch = event => {
    const inputSearch = event.target.value;
    this.handleSearch(inputSearch);
    this.setState({ inputSearch: event.target.value });
  };

  handleClaimPoints = () => {
    console.log('handleClaimPoints');
    this.setState({ toDashboard: true });
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

  goToDashboard = influencerID => (
    <Redirect
      push
      to={{
        pathname: '/dashboard',
        search: `?i=${influencerID}`,
      }}
    />
  );

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
    } = this.state;

    if (toDashboard) return this.goToDashboard(influencerID);
    if (toHome) return this.goToHome();

    let leaderboard = null;
    if (fans) {
      leaderboard = fans.map((fan, index) => (
        <LeaderboardRow
          key={fan.username}
          points={fan.pointsTotal}
          profilePicURL={fan.profilePicURL}
          rank={fan.rank}
          // trophy={this.getTrophy(index)}
          username={fan.username}
        />
      ));
    }

    return (
      <div>
        <Content>
          <Fonts.H1 centered noMarginBottom>
            {influencerDisplayName}
            's Weekly Top{' '}
            <span role="img" aria-label="100">
              💯
            </span>
          </Fonts.H1>
          <br />
          <Searchbar
            type="text"
            onChange={this.handleChangeInputSearch}
            placeholder={'Search for a username'}
            value={inputSearch}
          />
          {leaderboard}
          <Content.Spacing />
          <Content.Spacing />
          <Content.Spacing />
          <Content.Spacing />
        </Content>
        <LeaderboardFooter handleClaimPoints={this.handleClaimPoints} />
      </div>
    );
  }
}

export default Leaderboard;
