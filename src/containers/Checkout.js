import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';
import validator from 'validator';

import actions from '../data/actions';
import Btn from '../components/Btn';
import Content from '../components/Content';
import Currency from '../components/Currency';
import Fonts from '../utils/Fonts';
import GiftImg from '../components/GiftImg';
import { formatUsername, getParams, getTimestamp } from '../utils/Helpers';
import InputText from '../components/InputText';
import PayPalCheckout from '../components/PayPalCheckout';

const CLIENT = {
  sandbox: process.env.REACT_APP_PAYPAL_CLIENT_ID_SANDBOX,
  production: process.env.REACT_APP_PAYPAL_CLIENT_ID_PRODUCTION,
};
const ENV = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox';
const CURRENCY = 'USD';

const PAYPAL_VARIABLE_FEE = 0.036;
const PAYPAL_FIXED_FEE = 0.3;

class Checkout extends React.Component {
  state = {
    checkoutStep: 0,
    email: '',
    emailErrMsg: '',
    emailIsValid: false,
    gift: {
      gemsEarned: '-',
      imgURL: '',
      influencerID: '',
      id: '',
      name: '',
      price: '-',
    },
    influencer: {
      displayName: '',
      username: '',
      id: '',
    },
    orderID: '',
    paypalErrorMsg: '',
    toConfirmation: false,
    username: '',
    usernameErrMsg: '',
    usernameIsValid: false,
  };

  componentDidMount() {
    this.setData();
    mixpanel.track('Visited Checkout');
  }

  addGiftOrder = async paypalPaymentID => {
    const { email, gift, influencer, username } = this.state;
    const usernameFormatted = formatUsername(username);
    const txn = await actions.addDocTxn({
      changePointsComments: 0,
      changePointsPaid: gift.gemsEarned,
      influencerID: influencer.id,
      timestamp: getTimestamp(),
      username: usernameFormatted,
    });
    const orderNum = await actions.fetchOrderNum();
    const order = await actions.addDocOrder({
      email,
      giftID: gift.id,
      paypalFee: this.getPaypalFee(gift.price),
      total: gift.price,
      txnID: txn.id,
      orderNum,
      paypalPaymentID,
      username: usernameFormatted,
      purchaseDate: getTimestamp(),
    });
    this.setState({ orderID: order.id, toConfirmation: true });

    mixpanel.track('Purchased Gift', { influencer: influencer.username });
    mixpanel.people.track_charge(gift.price);
  };

  getGiftID = () => {
    const { gift } = getParams(this.props);
    return gift;
  };

  getPaypalFee = price => price * PAYPAL_VARIABLE_FEE + PAYPAL_FIXED_FEE;

  goToConfirmation = () => {
    const { orderID } = this.state;
    return (
      <Redirect
        push
        to={{
          pathname: '/confirmation',
          search: `?id=${orderID}`,
        }}
      />
    );
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

  handleNext = () => {
    if (this.isUsernameValid() && this.isEmailValid()) {
      const { influencer } = this.state;
      this.setState({ checkoutStep: 1 });
      mixpanel.track('Completed Checkout Info', { influencer: influencer.username });
    }
  };

  handlePrev = () => this.setState({ checkoutStep: 0 });

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

  onSuccess = async payment => {
    await this.addGiftOrder(payment.paymentID);
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

  setData = async () => {
    const giftID = this.getGiftID();
    const gift = await actions.fetchDocGift(giftID);
    const { influencerID } = gift;
    const influencer = await actions.fetchDocInfluencerByID(influencerID);
    this.setState({ gift, influencer });
  };

  setInfluencer = async () => {};

  render() {
    const {
      checkoutStep,
      email,
      emailErrMsg,
      emailIsValid,
      gift,
      influencer,
      paypalErrorMsg,
      toConfirmation,
      username,
      usernameErrMsg,
      usernameIsValid,
    } = this.state;

    if (toConfirmation) return this.goToConfirmation();

    const btnPayPal = (
      <PayPalCheckout
        client={CLIENT}
        commit
        currency={CURRENCY}
        env={ENV}
        description={`Virtual ${gift.name} gift for ${influencer.displayName}`}
        onSuccess={this.onSuccess}
        onError={this.onError}
        onCancel={this.onCancel}
        total={gift.price}
      />
    );

    const paypalError = paypalErrorMsg ? <Fonts.ERROR>{paypalErrorMsg}</Fonts.ERROR> : null;

    const paymentForm =
      emailIsValid && usernameIsValid ? (
        <div>
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
              By clicking on Checkout, you agree with the{' '}
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
          <Content.Spacing8px />
          <Content.Row justifyStart>
            <Btn.Tertiary onClick={this.handlePrev}>Back</Btn.Tertiary>
          </Content.Row>
        </div>
      ) : null;

    const infoForm = (
      <div>
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
        <Content.Row justifyEnd>
          <Btn primary short narrow onClick={this.handleNext}>
            Next
          </Btn>
        </Content.Row>
      </div>
    );

    const checkoutContent = checkoutStep === 0 ? infoForm : paymentForm;

    return (
      <Content>
        <Fonts.H1 centered>
          Send {influencer.displayName} {gift.name}
        </Fonts.H1>
        <Content.Row justifyCenter>
          <GiftImg src={gift.imgURL} />
        </Content.Row>
        <Fonts.H3 centered>{influencer.displayName} will be so happy!</Fonts.H3>
        <Content.Seperator />
        {checkoutContent}
      </Content>
    );
  }
}

export default Checkout;
