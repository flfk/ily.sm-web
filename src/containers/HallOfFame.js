import _ from 'lodash';
import mixpanel from 'mixpanel-browser';
import React from 'react';

import actions from '../data/actions';
import Content from '../components/Content';
import HallOfFameRow from '../components/HallOfFameRow';
import Header from '../components/Header';
import { getParams } from '../utils/Helpers';
import Spinner from '../components/Spinner';

const USERS = [
  {
    profilePicURL:
      'https://instagram.faep4-1.fna.fbcdn.net/vp/85bf51f7effe5895dbbb38c149a31447/5CB1296B/t51.2885-19/s320x320/44698462_311872806084029_988073122118762496_n.jpg',
    username: 'testing',
  },
  {
    profilePicURL:
      'https://instagram.faep4-1.fna.fbcdn.net/vp/85bf51f7effe5895dbbb38c149a31447/5CB1296B/t51.2885-19/s320x320/44698462_311872806084029_988073122118762496_n.jpg',
    username: 'testing2',
  },
];

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
    posts: [],
  };

  componentDidMount() {
    this.setData();
  }

  fetchInfluencer = async () => {
    const { i } = getParams(this.props);
    const influencer = await actions.fetchDocInfluencerByField('username', i);
    return influencer;
  };

  fetchPosts = async influencerID => {
    const posts = await actions.fetchCollPosts(influencerID);
    return posts;
  };

  getWinners = comments => {
    const usernames = comments.map(comment => comment.username);
    const commentsAggregated = _.chain(usernames)
      .uniq()
      .map(username => ({
        username,
        count: usernames.filter(name => name === username).length,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((fan, index) => ({ ...fan, rank: index + 1 }))
      .value();
    const winners = commentsAggregated.map(fan => {
      const userExisting = USERS.find(user => user.username === fan.username);
      if (userExisting) {
        return { ...fan, profilePicURL: userExisting.profilePicURL };
      }
      return fan;
    });
    return winners;
  };

  setData = async () => {
    const influencer = await this.fetchInfluencer();
    this.setState({ influencer });
    mixpanel.track('Visited Hall of Fame', { influencer: influencer.username });
    const posts = await this.fetchPosts(influencer.id);
    this.setState({ posts });
    this.setState({ isLoading: false });
  };

  render() {
    const { influencer, isLoading, posts } = this.state;

    if (isLoading) return <Spinner />;

    const postsDiv = posts.map((post, index) => (
      <HallOfFameRow
        key={post.code}
        dateFinished={index === 0 ? null : posts[index - 1].timestamp}
        imgURL={post.imgURL}
        winners={this.getWinners(post.comments)}
      />
    ));

    return (
      <Content>
        <Header
          fandom={influencer.fandom}
          profilePicURL={influencer.profilePicURL}
          selectedScreen={'HallOfFame'}
          username={influencer.username}
        />
        {postsDiv}
      </Content>
    );
  }
}

export default HallOfFame;
