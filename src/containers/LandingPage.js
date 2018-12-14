import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

const DEFAULT_INFLUENCER_USERNAME = 'jon_klaasen';

class LandingPage extends Component {
  render() {
    return (
      <Redirect
        push
        to={{
          pathname: `/${DEFAULT_INFLUENCER_USERNAME}`,
        }}
      />
    );
  }
}

export default LandingPage;
