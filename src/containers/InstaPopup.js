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
    const { code, token } = getParams(this.props);
    const error = this.getError();
    if (error) {
      console.log('error from instagram auth page', error);
    }
    if (!code && !token) {
      // this.setState({ toInstaLogin: true });
      this.callRedirect();
    }
    if (code) {
      this.callToken();
    }
    if (token) {
      this.tokenReceived(token);
    } else {
      // console.log('logged in with code', code);
      this.callToken();
      // this.addScript();

      // window.close();
    }
  }

  // addScript = () => {
  //   console.log('addScript called');
  //   const { code, state } = getParams(this.props);
  //   const script = document.createElement('script');
  //   script.type = 'text/javascript';
  //   // This is the URL to the HTTP triggered 'token' Firebase Function.
  //   // See https://firebase.google.com/docs/functions.
  //   const tokenFunctionURL =
  //     'https://us-central1-' + this.getFirebaseProjectId() + '.cloudfunctions.net/token';
  //   script.src =
  //     tokenFunctionURL +
  //     '?code=' +
  //     encodeURIComponent(code) +
  //     '&state=' +
  //     encodeURIComponent(state) +
  //     '&callback=' +
  //     this.tokenReceived.name;
  //   document.head.appendChild(script);
  // };

  callToken = () => {
    console.log('calling Token');
    const tokenFunctionURL = `https://us-central1-${this.getFirebaseProjectId()}.cloudfunctions.net/token`;
    const { code, state } = getParams(this.props);
    console.log('code', code);
    console.log('state', state);
    console.log('tokenReceived', this.tokenReceived.name);
    const scriptSrc =
      tokenFunctionURL +
      '?code=' +
      encodeURIComponent(code) +
      '&state=' +
      encodeURIComponent(state) +
      '&callback=' +
      this.tokenReceived.name;
    console.log(scriptSrc);
    // fetch(scriptSrc)
    // .then(res => console.log(res))
    // .catch(error => console.log('error in call Token async', error));
    // window.location.href = scriptSrc;
  };

  callRedirect = () => {
    console.log('calling redirect');
    window.location.href = `https://us-central1-${this.getFirebaseProjectId()}.cloudfunctions.net/redirect`;
  };

  getCode = () => {
    const { code } = getParams(this.props);
    return code;
  };

  getError = () => {
    const { error } = getParams(this.props);
    return error;
  };

  getState = () => {
    const { state } = getParams(this.props);
    return state;
  };

  getFirebaseProjectId = () => app.options.authDomain.split('.')[0];

  // goToInstaLogin = () => (
  //   <Redirect
  //     push
  //     to={{
  //       pathname: '/instagram-login',
  //     }}
  //   />
  // );

  tokenReceived = token => {
    console.log('tokenRecieved called');
    if (token) {
      auth.signInWithCustomToken(token);
      console.log('signed in with tokenRecieved');
      // .then(() => window.close());
    } else {
      console.error(token);
      document.body.innerText = 'Error in the token Function: ';
    }
  };

  render() {
    // const { toInstaLogin } = this.state;

    console.log('params', getParams(this.props));

    // if (toInstaLogin) return this.goToInstaLogin();

    return (
      <Content>
        <Spinner />
      </Content>
    );
  }
}

export default InstaPopup;
