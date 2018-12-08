import React from 'react';
import { Redirect } from 'react-router-dom';

import { app, auth } from '../data/firebase';
import Btn from '../components/Btn';
import Content from '../components/Content';
import Fonts from '../utils/Fonts';
import { getParams } from '../utils/Helpers';
import Spinner from '../components/Spinner';

class InstaPopup extends React.Component {
  state = {
    toInstaLogin: false,
  };

  componentDidMount() {
    const code = this.getCode();
    const error = this.getError();
    if (error) {
      console.log('error from instagram auth page', error);
    }
    if (!code) {
      this.setState({ toInstaLogin: true });
    } else {
      console.log('logged in with code', code);
      this.callRedirect();
      // window.close();
    }
  }

  callRedirect = () =>
    (window.location.href = `https://us-central1-${this.getFirebaseProjectId()}.cloudfunctions.net/redirect`);

  getCode = () => {
    const { code } = getParams(this.props);
    return code;
  };

  getError = () => {
    const { error } = getParams(this.props);
    return error;
  };

  getFirebaseProjectId = () => app.options.authDomain.split('.')[0];

  goToInstaLogin = () => (
    <Redirect
      push
      to={{
        pathname: '/instagram-login',
      }}
    />
  );

  tokenRecieved = data => {
    // try {
    //   await auth.signInWithCustomToken(token);

    //   // window.close();
    // } catch (error) {
    //   console.log('Error, InstaPopup, tokenRecieved ', error);
    // }

    if (data.token) {
      auth.signInWithCustomToken(data.token);
      // .then(function() {
      // window.close();
      // });
    } else {
      console.error(data);
      document.body.innerText = 'Error in the token Function: ' + data.error;
    }
  };

  render() {
    const { toInstaLogin } = this.state;

    console.log('id', this.getFirebaseProjectId());

    if (toInstaLogin) return this.goToInstaLogin();

    return (
      <Content>
        <Spinner />
      </Content>
    );
  }
}

export default InstaPopup;
