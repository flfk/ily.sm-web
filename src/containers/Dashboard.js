import mixpanel from 'mixpanel-browser';
// import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import actions from '../data/actions';
import Coins from '../components/dashboard/Coins';
import Content from '../components/Content';
import Fonts from '../utils/Fonts';
import { getTimestamp, getParams, getFormattedNumber } from '../utils/Helpers';
import { InfluencerProfile, Trophies, MerchRow, Profile, Stats } from '../components/dashboard';
import PopupComingSoon from '../components/dashboard/PopupComingSoon';
import PopupGetPrize from '../components/dashboard/PopupGetPrize';
import PopupNoUser from '../components/dashboard/PopupNoUser';

import SCORECARDS from '../data/dashboards/jon_klaasen';

const WEEK_INDEX = 1;

// const propTypes = {};

// const defaultProps = {};

class Dashboard extends React.Component {
  state = {
    influencer: {
      coinName: '',
      fanCount: 0,
      name: '',
      username: '',
    },
    merch: [],
    merchSelected: {
      merchID: '',
      name: '',
      price: 0,
    },
    showPopupComingSoon: false,
    showPopupGetPrize: false,
    showPopupNoUser: false,
    user: {
      username: '',
      points: 0,
      profilePicURL: '',
      rank: 0,
      // NEW ENDPOINTS
      pointsAllTime: 1000000,
      pointsComments: 999,
      pointsTags: 888,
      pointsTotal: 777,
      pointsTrophies: 666,
      trophies: [],
      // EXPIRED ENDPOINTS
      postsCommented: [],
      postsLiked: [],
      uniqueTags: [],
    },
    usernameInput: '',
    usernameInputErrMsg: '',
  };

  componentDidMount() {
    this.setInfluencer();
    this.getFanUsername();
    this.setMerch();
    mixpanel.track('Visited Dashboard');
  }

  addUsernameToURL = username => {
    const influencerID = this.getInfluencerID();
    const { history } = this.props;
    history.push({
      pathname: '/dashboard',
      search: `?i=${influencerID}&u=${username}`,
    });
  };

  formatUsername = username =>
    username
      .toLowerCase()
      .replace('@', '')
      .trim();

  getInfluencerID = () => {
    const { i } = getParams(this.props);
    return i;
  };

  getFanUsername = () => {
    const { u } = getParams(this.props);
    if (u) {
      const usernameFormatted = this.formatUsername(u);
      const user = this.getUser(usernameFormatted);
      this.setUser(user);
    } else {
      this.setState({ showPopupNoUser: true });
    }
    return u;
  };

  getUser = username => {
    const usernameFormatted = this.formatUsername(username);
    const scorecards = SCORECARDS.filter(scorecard => scorecard.username === usernameFormatted);
    const user = scorecards.find(scorecard => scorecard.weekIndex === WEEK_INDEX);
    const pointsAllTime = scorecards.reduce((aggr, scorecard) => aggr + scorecard.pointsTotal, 0);
    const profilePicURL =
      scorecards.find(scorecard => scorecard.profilePicURL !== '').profilePicURL || '';
    if (user) {
      mixpanel.people.set({
        $name: username,
      });
    }
    return { ...user, pointsAllTime, profilePicURL };
  };

  handleBuyPoints = item => {
    mixpanel.track('Clicked Buy', { Item: item });
    // mixpanel.track('Visited Checkout', { eventID });
    this.setState({ showPopupGetPrize: false });
    this.setState({ showPopupComingSoon: true });
  };

  handleUsePoints = item => {
    mixpanel.track('Clicked Use Points', { Item: item });
    this.setState({ showPopupGetPrize: false });
    this.setState({ showPopupComingSoon: true });
  };

  handleChangeUsernameInput = event => this.setState({ usernameInput: event.target.value });

  handleSelectPrize = event => {
    const { merch } = this.state;
    const merchID = event.target.value;
    const merchSelected = merch.find(item => item.merchID === merchID);
    this.setState({ merchSelected });
    mixpanel.track('Selected Merch', { item: merchSelected.name });
    // this.setState({ showPopupGetPrize: true });
    this.setState({ showPopupComingSoon: true });
  };

  handlePopupClose = popupName => {
    const key = `showPopup${popupName}`;
    return () => this.setState({ [key]: false });
  };

  handleSearch = () => {
    const { usernameInput } = this.state;
    const usernameFormatted = this.formatUsername(usernameInput);
    const user = this.getUser(usernameFormatted);
    if (user) {
      this.setUser(user);
      this.addUsernameToURL(usernameFormatted);
    } else {
      this.handleSearchError(usernameFormatted);
    }
    mixpanel.track('Searched Username', { username: usernameFormatted });
  };

  handleSearchError = username => {
    if (username === '') {
      this.setState({
        usernameInputErrMsg: 'Type in your Instagram username above before clicking the button.',
      });
    } else {
      this.setState({
        usernameInputErrMsg: 'Oops, there are no results for that username. Please try again.',
      });
    }
  };

  setUser = user =>
    this.setState({
      showPopupNoUser: false,
      user,
      usernameInputErrMsg: '',
    });

  setInfluencer = () => {
    const influencerID = this.getInfluencerID();
    let influencer = {};
    switch (influencerID) {
      case 'jon_klaasen':
        influencer = JON_KLAASEN;
        break;
      case 'mackenziesol':
        influencer = MACKENZIE_SOL;
        break;
      case 'andreswilley':
        influencer = ANDRE_SWILLEY;
        break;
      case 'raeganbeast':
        influencer = RAEGAN_BESAT;
        break;
      default:
        influencer = JON_KLAASEN;
    }
    this.setState({ influencer });
  };

  setMerch = async () => {
    const merch = await Promise.all(
      MERCH.map(async item => {
        const imgURL = await actions.fetchMerchImgUrl(item.merchID);
        return { ...item, imgURL };
      })
    );
    this.setState({ merch });
  };

  render() {
    const {
      influencer,
      merch,
      merchSelected,
      showPopupComingSoon,
      showPopupGetPrize,
      showPopupNoUser,
      user,
      usernameInput,
      usernameInputErrMsg,
    } = this.state;

    const merchDiv = merch
      .sort((a, b) => a.price - b.price)
      .map(item => (
        <MerchRow
          key={item.name}
          handleClick={this.handleSelectPrize}
          imgURL={item.imgURL}
          price={item.price}
          merchID={item.merchID}
          name={item.name}
        />
      ));

    const popupNoUser = showPopupNoUser ? (
      <PopupNoUser
        handleChangeUsername={this.handleChangeUsernameInput}
        handleClose={this.handlePopupClose('NoUser')}
        handleSearch={this.handleSearch}
        influencerName={influencer.name}
        influencerUsername={influencer.username}
        username={usernameInput}
        usernameErrMsg={usernameInputErrMsg}
      />
    ) : null;

    const popupGetPrize = showPopupGetPrize ? (
      <PopupGetPrize
        handleBuyPoints={this.handleBuyPoints}
        handleClose={this.handlePopupClose('GetPrize')}
        handleUsePoints={this.handleUsePoints}
        imgURL={merchSelected.imgURL}
        name={merchSelected.name}
        points={user.points}
        price={merchSelected.price}
      />
    ) : null;

    const popupComingSoon = showPopupComingSoon ? (
      <PopupComingSoon handleClose={this.handlePopupClose('ComingSoon')} influencer={influencer} />
    ) : null;

    return (
      <div>
        <Content centered>
          <Fonts.H3 centered marginBottom8px>
            @{user.username}
          </Fonts.H3>
          <Profile trophies={user.trophies} profilePicURL={user.profilePicURL} />
          <Content.Seperator />

          <Fonts.H3 noMarginTop>This Week</Fonts.H3>
          <Fonts.H3 centered marginBottom4px noMarginTop>
            #{getFormattedNumber(user.rank)} of {getFormattedNumber(influencer.fanCount)}
          </Fonts.H3>
          <Link
            to={`/top?i=${influencer.influencerID}`}
            style={{ textAlign: 'center', textDecoration: 'none' }}
          >
            <Fonts.Link>
              <strong>See Leaderboard</strong>
            </Fonts.Link>
          </Link>
          <Fonts.H1 centered marginBottom8px extraLarge>
            <Coins.Icon /> {getFormattedNumber(user.pointsTotal)}
          </Fonts.H1>
          <Fonts.H3 centered noMarginTop marginBottom4px>
            Earned on
          </Fonts.H3>
          <InfluencerProfile
            influencerUsername={influencer.username}
            influencerProfilePicURL={influencer.profilePicURL}
          />
          <br />
          <Stats
            pointsComments={user.pointsComments}
            pointsTags={user.pointsTags}
            pointsTrophies={user.pointsTrophies}
          />
          <Content.Spacing />
          <Trophies trophies={user.trophies} />
          <Content.Spacing />
          <Fonts.P centered supporting>
            Updated every Wednesday
          </Fonts.P>
          <br />

          <Content.Seperator />

          {popupComingSoon}
          {popupGetPrize}
          {popupNoUser}
        </Content>
      </div>
    );
  }
}

const JON_KLAASEN = {
  coinName: 'Klassen Koins',
  fanCount: 64532,
  influencerID: 'jon_klaasen',
  name: 'Jon Klaasen',
  profilePicURL:
    'https://instagram.faep4-1.fna.fbcdn.net/vp/4c623d035365d5ed4c537becae2afa94/5C87D8CD/t51.2885-19/s150x150/36563227_239821553286740_6380728175147614208_n.jpg',
  username: 'jon_klaasen',
};

const MACKENZIE_SOL = {
  coinName: '',
  fanCount: 61941,
  influencerID: 'mackenziesol',
  name: 'Mackenzie Sol',
  profilePicURL:
    'https://instagram.faep4-1.fna.fbcdn.net/vp/20925bbb67e9f60e4ae6b19cd84dc3f3/5C6A6BA9/t51.2885-19/s320x320/43732018_170664100525239_5463104611311157248_n.jpg',
  username: 'mackenziesol',
};

const ANDRE_SWILLEY = {
  coinName: '',
  fanCount: 61941,
  influencerID: 'andreswilley',
  name: 'Andre Swilley',
  profilePicURL:
    'https://instagram.faep4-1.fna.fbcdn.net/vp/a681270ccd102a2fc3a7bd3f9d93dcc7/5C6EEAF9/t51.2885-19/s320x320/36636621_230670450991249_8383191844376281088_n.jpg',
  username: 'andreswilley',
};

const RAEGAN_BESAT = {
  coinName: '',
  fanCount: 61941,
  influencerID: 'raeganbeast',
  name: 'Raegan Beast',
  profilePicURL:
    'https://instagram.faep4-1.fna.fbcdn.net/vp/79f9075f20487b595dedd7b7f0cad29c/5C89F5E7/t51.2885-19/s320x320/43818200_308132383342801_6919666697288810496_n.jpg',
  username: 'raeganbeast',
};

const MERCH = [
  {
    merchID: 'VidCall10Min',
    name: '10 min 1-on-1 facetime',
    price: 1000000,
  },
  {
    merchID: 'VidCall5Min',
    name: '5 min 1-on-1 facetime',
    price: 600000,
  },
  {
    merchID: 'LikeCommentSpam',
    name: 'Like & comment spam',
    price: 50000,
  },
  // {
  //   merchID: 'FollowBack',
  //   name: 'Follow back',
  //   price: 500000,
  // },
  {
    merchID: 'Shoutout',
    name: 'Personal story shoutout',
    price: 1500000,
  },
  {
    merchID: 'DMReply',
    name: 'Personal DM',
    price: 300000,
  },
  {
    merchID: 'SelfieVid',
    name: 'Selfie thank-you video',
    price: 400000,
  },
];

// Dashboard.propTypes = propTypes;
// Dashboard.defaultProps = defaultProps;

export default Dashboard;
