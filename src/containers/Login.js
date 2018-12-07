import React from 'react';

import Btn from '../components/Btn';
import Content from '../components/Content';
import Fonts from '../utils/Fonts';
import { getParams } from '../utils/Helpers';

class Login extends React.Component {
  state = {};

  componentDidMount() {}

  handleLogIn = () => {
    console.log('logging in');
    const clientID = process.env.REACT_APP_INSTA_CLIENT_ID;
    const redirectURI = 'http://localhost:3000/instagram-callback';
    const url = `https://api.instagram.com/oauth/authorize/?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code`;
    window.open(url, 'name', 'height=585,width=400');
  };

  render() {
    return (
      <Content>
        <Fonts.H1>Log In with Instagram to Claim your Points</Fonts.H1>
        <Btn primary short onClick={this.handleLogIn}>
          Log In
        </Btn>
      </Content>
    );
  }
}

export default Login;
