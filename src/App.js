import React, { Component } from 'react';
import ReactGA from 'react-ga';
import mixpanel from 'mixpanel-browser';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import Checkout from './containers/Checkout';
import Dashboard from './containers/Dashboard';
import Gift from './containers/Gift';
import LandingPage from './containers/LandingPage';
import Leaderboard from './containers/Leaderboard';
import NavBar from './containers/NavBar';
import OrderConfirmation from './containers/OrderConfirmation';
import StorePoints from './containers/StorePoints';
import PolicyTermsConditions from './containers/PolicyTermsConditions';
import PolicyCookies from './containers/PolicyCookies';
import PolicyPrivacy from './containers/PolicyPrivacy';

class App extends Component {
  constructor(props) {
    super(props);
    this.initAnalaytics();
  }

  initAnalaytics = () => {
    if (process.env.NODE_ENV === 'development') {
      mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN_DEV);
      mixpanel.identify();
    } else {
      this.initGoogleAnalytics(process.env.REACT_APP_GOOGLE_ANALYTICS_TOKEN);
      mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN_PROD);
      mixpanel.identify();
    }
  };

  initGoogleAnalytics = token => {
    ReactGA.initialize(token);
    ReactGA.pageview(window.location.pathname + window.location.search);
  };

  render() {
    return (
      <BrowserRouter>
        <div>
          <NavBar />
          <Switch>
            <Route path="/checkout" component={Checkout} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/confirmation" component={OrderConfirmation} />
            <Route path="/gift" component={Gift} />
            <Route path="/gems" component={StorePoints} />
            <Route path="/top" component={Leaderboard} />
            <Route path="/termsConditions" component={PolicyTermsConditions} />
            <Route path="/privacyPolicy" component={PolicyPrivacy} />
            <Route path="/cookiesPolicy" component={PolicyCookies} />
            <Route path="/home" component={LandingPage} />
            <Route path="/" component={Leaderboard} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
