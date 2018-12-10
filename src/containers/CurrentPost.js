import mixpanel from 'mixpanel-browser';
import React from 'react';
import { Redirect } from 'react-router-dom';

import actions from '../data/actions';
import Content from '../components/Content';
import Header from '../components/Header';
import { getPathname } from '../utils/Helpers';
import Fonts from '../utils/Fonts';
import Spinner from '../components/Spinner';

class CurrentPost extends React.Component {
  state = {
    influencer: {
      dateUpdateLast: 0,
      displayName: '',
      fandom: '',
      id: '',
      mostRecentImgURL: '',
      username: '',
    },
    isLoading: true,
    comments: [],
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
    const influencer = await actions.fetchDocInfluencerByField('username', pathname);
    return influencer;
  };

  setData = async () => {
    const influencer = await this.fetchInfluencer();
    this.setState({ influencer });
    if (!influencer) {
      this.setState({ toHome: true });
    } else {
      mixpanel.track('Visited Leaderboard', { influencer: influencer.username });
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { influencer, isLoading } = this.state;

    if (isLoading) return <Spinner />;

    console.log(influencer);

    return (
      <Content>
        CurrentPost
        <Header
          fandom={influencer.fandom}
          profilePicURL={influencer.profilePicURL}
          selectedScreen={'CurrentPost'}
          username={influencer.username}
        />
      </Content>
    );
  }
}

export default CurrentPost;
