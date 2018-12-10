import _ from 'lodash';
import mixpanel from 'mixpanel-browser';
import React from 'react';

import actions from '../data/actions';
import Content from '../components/Content';
import HallOfFameRow from '../components/HallOfFameRow';
import Header from '../components/Header';
import { getParams } from '../utils/Helpers';
import Fonts from '../utils/Fonts';
import Spinner from '../components/Spinner';
import Wrapper from '../components/Wrapper';

const POSTS = [
  {
    code: 'BrJu1c0AbIz',
    comments: [
      { username: 'testing2', text: 'hello world' },
      { username: 'testing', text: 'hello world' },
      { username: 'testing', text: 'hello world' },
    ],
    imgURL:
      'https://instagram.faep4-1.fna.fbcdn.net/vp/44646ad8bcb6b6ec554de5eebf7ffc8a/5CADE2CE/t51.2885-15/sh0.08/e35/s640x640/45454528_2147871442121795_3610633011215142597_n.jpg?_nc_ht=instagram.faep4-1.fna.fbcdn.net',
    influencerID: '3iZ4jV8gUfmEEdNSz6NE',
    timestamp: 1544089660000,
  },
  {
    code: 'BrCf8iVgqiG',
    comments: [
      { username: 'testing2', text: 'hello world' },
      { username: 'testing', text: 'hello world' },
      { username: 'testing', text: 'hello world' },
      { username: 'testing3', text: 'hello world' },
    ],
    imgURL:
      'https://instagram.faep4-1.fna.fbcdn.net/vp/fac36e8a6bcb957aa705842026421b72/5C998E46/t51.2885-15/e35/46380423_209286899954780_8459270140693207604_n.jpg',
    influencerID: '3iZ4jV8gUfmEEdNSz6NE',
    timestamp: 1544084660000,
  },
];

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
    posts: POSTS,
  };

  componentDidMount() {
    this.setData();
  }

  fetchInfluencer = async () => {
    const { i } = getParams(this.props);
    const influencer = await actions.fetchDocInfluencerByField('username', i);
    return influencer;
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
