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

const MAX_ROWS = 100;

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

  getFans = commenters => {
    const { influencer } = this.state;
    const fans = commenters
      .filter(commenter => commenter.username !== influencer.username)
      .sort((a, b) => b.count - a.count)
      .map((fan, index) => ({ ...fan, rank: index + 1 }));
    // .map(fan => {
    //   const userExisting = USERS.find(user => user.username === fan.username);
    //   if (userExisting) {
    //     return { ...fan, profilePicURL: userExisting.profilePicURL };
    //   }
    //   return fan;
    // });
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
    const postMostRecent = await this.fetchPost(influencer.codeMostRecent);
    let fans = [];
    if (postMostRecent.commenters) {
      fans = this.getFans(postMostRecent.commenters);
    } else {
      this.setState({ toHome: true });
    }
    this.setState({ fans, postMostRecent });
    this.setState({ isLoading: false });
  };

  render() {
    const { fans, influencer, isLoading, postMostRecent, toHome } = this.state;

    if (toHome) return this.goToHome();

    if (isLoading) return <Spinner />;

    const rows = fans
      .slice(0, MAX_ROWS)
      .map(fan => (
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
            <img src={postMostRecent.imgURL} alt="Most recent post" />
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
