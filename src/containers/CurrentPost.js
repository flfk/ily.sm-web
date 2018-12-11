import _ from 'lodash';
import mixpanel from 'mixpanel-browser';
import moment from 'moment-timezone';
import React from 'react';
import { Redirect } from 'react-router-dom';

import actions from '../data/actions';
import Content from '../components/Content';
import CommentCountRow from '../components/CommentCountRow';
import Header from '../components/Header';
import { getPathname } from '../utils/Helpers';
import Fonts from '../utils/Fonts';
import Spinner from '../components/Spinner';
import Wrapper from '../components/Wrapper';

// const POST = {
//   code: 'BrJu1c0AbIz',
//   comments: [
//     { username: 'testing2', text: 'hello world' },
//     { username: 'testing', text: 'hello world' },
//     { username: 'testing', text: 'hello world' },
//   ],
//   imgURL:
//     'https://instagram.faep4-1.fna.fbcdn.net/vp/44646ad8bcb6b6ec554de5eebf7ffc8a/5CADE2CE/t51.2885-15/sh0.08/e35/s640x640/45454528_2147871442121795_3610633011215142597_n.jpg?_nc_ht=instagram.faep4-1.fna.fbcdn.net',
//   influencerID: '3iZ4jV8gUfmEEdNSz6NE',
//   timestamp: '',
// };

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

class CurrentPost extends React.Component {
  state = {
    fans: [],
    influencer: {
      dateUpdateLast: 0,
      displayName: '',
      fandom: '',
      id: '',
      username: '',
    },
    isLoading: true,
    toHome: false,
    postMostRecent: {},
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

  fetchPost = async code => {
    const post = await actions.fetchDocPostByField('code', code);
    return post;
  };

  getFans = comments => {
    const usernames = comments.map(comment => comment.username);
    const commentsAggregated = _.chain(usernames)
      .uniq()
      .map(username => ({
        username,
        count: usernames.filter(name => name === username).length,
      }))
      .sort((a, b) => b.count - a.count)
      .map((fan, index) => ({ ...fan, rank: index + 1 }))
      .value();
    const fans = commentsAggregated.map(fan => {
      const userExisting = USERS.find(user => user.username === fan.username);
      if (userExisting) {
        return { ...fan, profilePicURL: userExisting.profilePicURL };
      }
      return fan;
    });
    return fans;
  };

  goToHome = () => (
    <Redirect
      push
      to={{
        pathname: '/home',
      }}
    />
  );

  setData = async () => {
    const influencer = await this.fetchInfluencer();
    this.setState({ influencer });
    if (!influencer) {
      this.setState({ toHome: true });
    } else {
      mixpanel.track('Visited Current Post', { influencer: influencer.username });
    }
    const mostRecent = await this.fetchPost(influencer.codeMostRecent);
    const fans = this.getFans(mostRecent.comments);
    this.setState({ fans, mostRecent });
    this.setState({ isLoading: false });
  };

  render() {
    const { fans, influencer, isLoading, mostRecent, toHome } = this.state;

    if (toHome) return this.goToHome();

    if (isLoading) return <Spinner />;

    const rows = fans.map(fan => (
      <CommentCountRow
        key={fan.username}
        count={fan.count}
        profilePicURL={fan.profilePicURL}
        rank={fan.rank}
        username={fan.username}
      />
    ));

    return (
      <Content>
        <Header
          fandom={influencer.fandom}
          profilePicURL={influencer.profilePicURL}
          selectedScreen={'CurrentPost'}
          username={influencer.username}
        />
        <Fonts.P isSupporting centered>
          Last updated {moment(influencer.dateUpdateLast).fromNow()}
        </Fonts.P>
        <Content.Spacing8px />
        <Content.Row justifyCenter>
          <Wrapper.Post isLarge>
            <img src={mostRecent.imgURL} alt="Most recent post" />
          </Wrapper.Post>
        </Content.Row>
        <Content.Spacing8px />
        {rows}
        <Content.Spacing />
      </Content>
    );
  }
}

export default CurrentPost;
