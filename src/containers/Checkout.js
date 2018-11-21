import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import validator from 'validator';

import actions from '../data/actions';
import Content from '../components/Content';
import Currency from '../components/Currency';
import Fonts from '../utils/Fonts';
import GiftImg from '../components/GiftImg';
import { getParams } from '../utils/Helpers';
import InputText from '../components/InputText';
import PayPalCheckout from '../components/PayPalCheckout';

const CLIENT = {
  sandbox: process.env.REACT_APP_PAYPAL_CLIENT_ID_SANDBOX,
  production: process.env.REACT_APP_PAYPAL_CLIENT_ID_PRODUCTION,
};
const ENV = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox';
const CURRENCY = 'USD';

const PRICE_PLACE_HOLDER = 9.99;

class Checkout extends React.Component {
  state = {
    email: '',
    emailErrMsg: '',
    emailIsValid: false,
    gift: {
      gemsEarned: '-',
      imgURL: '',
      influencerID: '',
      name: '',
      price: '-',
    },
    hasTouchedEmail: false,
    hasTouchedUsername: false,
    paypalErrorMsg: '',
    username: '',
    usernameErrMsg: '',
    usernameIsValid: false,
  };

  componentDidMount() {
    this.setGift();
  }

  getGiftID = () => {
    const { gift } = getParams(this.props);
    return gift;
  };

  handleBlurEmail = () => {
    const isValid = this.isEmailValid();
    this.setState({ emailIsValid: isValid });
  };

  handleBlurUsername = () => {
    const isValid = this.isUsernameValid();
    this.setState({ usernameIsValid: isValid });
  };

  handleChangeInput = field => event => this.setState({ [field]: event.target.value });

  isEmailValid = () => {
    const { email } = this.state;
    if (!validator.isEmail(email)) {
      this.setState({ emailErrMsg: 'Valid email address required.' });
      return false;
    }
    this.setState({ emailErrMsg: '' });
    return true;
  };

  isUsernameValid = () => {
    const { username } = this.state;
    if (username === '') {
      this.setState({ usernameErrMsg: 'Instagram username required.' });
      return false;
    }
    this.setState({ usernameErrMsg: '' });
    return true;
  };

  onSuccess = payment => {
    // TODO
  };

  onError = error => {
    this.setState({
      paypalErrorMsg: 'Oops, looks like there was a PayPal payment error. Please try again.',
    });
    console.error('Paypal error: Erroneous payment OR failed to load script', error);
  };

  onCancel = data => {
    this.setState({
      paypalErrorMsg: 'Oops, looks like the Paypal payment was cancelled. Please try again.',
    });
    console.error('Cancelled payment', data);
  };

  setGift = async () => {
    const giftID = this.getGiftID();
    const gift = await actions.fetchDocGift(giftID);
    this.setState({ gift });
  };

  validateForm = () => {
    const { username, email } = this.state;
    let isFormValid = true;
    if (username === '') {
      this.setState({ usernameErrMsg: 'Instagram username required.' });
      isFormValid = false;
    } else {
      this.setState({ usernameErrMsg: '' });
    }
    if (!validator.isEmail(email)) {
      this.setState({ emailErrMsg: 'Valid email address required.' });
      isFormValid = false;
    } else {
      this.setState({ emailErrMsg: '' });
    }
    return isFormValid;
  };

  render() {
    const {
      email,
      emailErrMsg,
      emailIsValid,
      gift,
      paypalErrorMsg,
      username,
      usernameErrMsg,
      usernameIsValid,
    } = this.state;

    const btnPayPal = (
      <PayPalCheckout
        client={CLIENT}
        env={ENV}
        commit
        currency={CURRENCY}
        total={PRICE_PLACE_HOLDER}
        onSuccess={this.onSuccess}
        onError={this.onError}
        onCancel={this.onCancel}
        validateForm={this.validateForm}
        isFormValid
      />
    );

    const paypalError = paypalErrorMsg ? <Fonts.ERROR>{paypalErrorMsg}</Fonts.ERROR> : null;

    const paymentForm =
      emailIsValid && usernameIsValid ? (
        <div>
          <Content.Seperator />
          <Content.Row>
            <Fonts.P centered>You'll receive</Fonts.P>
            <Fonts.H3 centered noMargin>
              <Currency.GemsSingle small /> {gift.gemsEarned}
            </Fonts.H3>
          </Content.Row>
          <Content.Spacing8px />
          <Content.Row>
            <Fonts.P centered>Total price</Fonts.P>
            <Fonts.H3 centered noMargin>
              $ {gift.price}
            </Fonts.H3>
          </Content.Row>
          <Content.Spacing />
          {paypalError}
          {btnPayPal}
          <Content>
            <Fonts.FinePrint>
              By clicking on Checkout, you agree with Meetsta's{' '}
              <Link to="/termsConditions" target="_blank">
                Terms and Conditions of Use
              </Link>{' '}
              and{' '}
              <Link to="/privacyPolicy" target="_blank">
                Privacy Policy
              </Link>
              .
            </Fonts.FinePrint>
          </Content>
        </div>
      ) : null;

    return (
      <Content>
        <Fonts.H1 centered>Send Jon {gift.name}</Fonts.H1>
        <Content.Row justifyCenter>
          <GiftImg src={gift.imgURL} />
        </Content.Row>
        <Fonts.H3 centered>Jon will be so happy!</Fonts.H3>
        <Content.Seperator />
        <InputText
          errMsg={usernameErrMsg}
          label="Instagram username to recieve gems"
          placeholder="@myInstaAccount"
          onBlur={this.handleBlurUsername}
          onChange={this.handleChangeInput('username')}
          value={username}
          isValid={usernameIsValid}
        />
        <InputText
          errMsg={emailErrMsg}
          label="Email to send confirmation to"
          placeholder="MyEmail@example.com"
          onBlur={this.handleBlurEmail}
          onChange={this.handleChangeInput('email')}
          value={email}
          isValid={emailIsValid}
        />
        {paymentForm}
      </Content>
    );
  }
}

export default Checkout;
