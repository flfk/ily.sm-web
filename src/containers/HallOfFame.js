import mixpanel from 'mixpanel-browser';
import React from 'react';
import { Redirect } from 'react-router-dom';

import actions from '../data/actions';
import Content from '../components/Content';
import Header from '../components/Header';
import { getParams } from '../utils/Helpers';
import Fonts from '../utils/Fonts';
import Spinner from '../components/Spinner';

class HallOfFame extends React.Component {
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
    this.setData();
  }

  fetchInfluencer = async () => {
    const { i } = getParams(this.props);
    const influencer = await actions.fetchDocInfluencerByField('username', i);
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
        Hall Of Fame
        <Header
          fandom={influencer.fandom}
          profilePicURL={influencer.profilePicURL}
          selectedScreen={'HallOfFame'}
          username={influencer.username}
        />
      </Content>
    );
  }
}

export default HallOfFame;
