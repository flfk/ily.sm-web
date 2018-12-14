import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { Provider } from 'react-redux';
import mixpanel from 'mixpanel-browser';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import Admin from './containers/Admin';
import Checkout from './containers/Checkout';
import CurrentPost from './containers/CurrentPost';
import Dashboard from './containers/Dashboard';
import Gift from './containers/Gift';
import GiftStore from './containers/GiftStore';
import GemStore from './containers/GemStore';
import HallOfFame from './containers/HallOfFame';
import InsufficientGems from './containers/InsufficientGems';
import LandingPage from './containers/LandingPage';
import LogIn from './containers/LogIn';
import NavBar from './containers/NavBar';
import MessageStore from './containers/MessageStore';
import OrderConfirmation from './containers/OrderConfirmation';
import PolicyTermsConditions from './containers/PolicyTermsConditions';
import PolicyCookies from './containers/PolicyCookies';
import PolicyPrivacy from './containers/PolicyPrivacy';
import Prizes from './containers/Prizes';
import Profile from './containers/Profile';
import SignUp from './containers/SignUp';
import Verification from './containers/Verification';

import store from './data/redux/Store';

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
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <NavBar />
            <Switch>
              <Route path="/admin-admin-1" component={Admin} />
              <Route path="/admin-verification" component={Verification} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/confirmation" component={OrderConfirmation} />
              <Route path="/gems" component={GemStore} />
              <Route path="/gift" component={Gift} />
              <Route path="/gifts" component={GiftStore} />
              <Route path="/halloffame" component={HallOfFame} />
              <Route path="/insufficient" component={InsufficientGems} />
              <Route path="/home" component={LandingPage} />
              <Route path="/login" component={LogIn} />
              <Route path="/message" component={MessageStore} />
              <Route path="/prizes" component={Prizes} />
              <Route path="/privacyPolicy" component={PolicyPrivacy} />
              <Route path="/profile" component={Profile} />
              <Route path="/termsConditions" component={PolicyTermsConditions} />
              <Route path="/signup" component={SignUp} />
              <Route path="/cookiesPolicy" component={PolicyCookies} />

              <Route path="/" component={CurrentPost} />
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
