import React from 'react';
import { Redirect, Link } from 'react-router-dom';

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
    gift: {
      gemsEarned: '-',
      imgURL: '',
      influencerID: '',
      name: '',
      price: '-',
    },
    paypalErrorMsg: '',
    username: '',
    usernameErrMsg: '',
  };

  componentDidMount() {
    this.setGift();
  }

  getGiftID = () => {
    const { gift } = getParams(this.props);
    return gift;
  };

  handleChangeEmail = event => this.setState({ email: event.target.value });

  handleChangeUsername = event => this.setState({ username: event.target.value });

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
    // TODO
  };

  render() {
    const { email, emailErrMsg, gift, paypalErrorMsg, username, usernameErrMsg } = this.state;

    console.log('gift', gift);

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

    return (
      <Content>
        <Fonts.H1 centered>Send Jon {gift.name}</Fonts.H1>
        <Content.Row justifyCenter>
          <GiftImg src={gift.imgURL} />
        </Content.Row>
        <Fonts.H3 centered>Jon will be so happy!</Fonts.H3>
        <Content.Seperator />
        <InputText
          label="Instagram username to recieve gems"
          placeholder="@myInstaAccount"
          onChange={this.handleChangeUsername}
          value={username}
          errMsg={usernameErrMsg}
        />
        <InputText
          label="Email to send confirmation to"
          placeholder="MyEmail@example.com"
          onChange={this.handleChangeEmail}
          value={email}
          errMsg={emailErrMsg}
        />
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
      </Content>
    );
  }
}

export default Checkout;
