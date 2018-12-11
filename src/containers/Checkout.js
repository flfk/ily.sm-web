import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';
// import validator from 'validator';

import actions from '../data/actions';
import Btn from '../components/Btn';
import Content from '../components/Content';
import Currency from '../components/Currency';
import Fonts from '../utils/Fonts';
import GiftImg from '../components/GiftImg';
import { formatUsername, getParams, getTimestamp } from '../utils/Helpers';
import InputText from '../components/InputText';
import Popup from '../components/Popup';
import Spinner from '../components/Spinner';
import PayPalCheckout from '../components/PayPalCheckout';

const CLIENT = {
  sandbox: process.env.REACT_APP_PAYPAL_CLIENT_ID_SANDBOX,
  production: process.env.REACT_APP_PAYPAL_CLIENT_ID_PRODUCTION,
};
const ENV = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox';
const CURRENCY = 'USD';

const PAYPAL_VARIABLE_FEE = 0.036;
const PAYPAL_FIXED_FEE = 0.3;

const GEM_PACK = {
  gems: 10,
  id: 'abc123',
  imgURL:
    'https://firebasestorage.googleapis.com/v0/b/ilysm-15824.appspot.com/o/gemPacks%2FGem3.png?alt=media&token=599883f4-1870-463e-a1c1-e2e136fb01c2',
  price: 9.99,
};

class Checkout extends React.Component {
  state = {
    gemPack: {},
    influencer: {
      displayName: '',
      username: '',
      id: '',
    },
    isLoading: true,
    orderID: '',
    paypalErrorMsg: '',
    toConfirmation: false,
  };

  componentDidMount() {
    this.setData();
    mixpanel.track('Visited Checkout');
  }

  addGiftOrder = async paypalPaymentID => {
    const { customName, customURL, gift, influencer, note, username } = this.state;
    const usernameFormatted = formatUsername(username);
    const txn = await actions.addDocTxn({
      changePointsComments: 0,
      changePointsPaid: gift.gemsEarned,
      influencerID: influencer.id,
      timestamp: getTimestamp(),
      username: usernameFormatted,
    });
    const orderNum = await actions.fetchOrderNum();
    let order = {
      note,
      giftID: gift.id,
      influencerID: influencer.id,
      paypalFee: this.getPaypalFee(gift.price),
      total: gift.price,
      txnID: txn.id,
      orderNum,
      paypalPaymentID,
      purchaseDate: getTimestamp(),
      username: usernameFormatted,
      wasOpened: false,
    };
    if (gift.isCustom) order = { ...order, customName, customURL, isCustom: true };
    const orderAdded = await actions.addDocOrder(order);
    this.setState({ orderID: orderAdded.id, toConfirmation: true });
    mixpanel.people.set({ $name: usernameFormatted });
    mixpanel.track('Purchased Gift', { influencer: influencer.username, gift: gift.name });
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

  handleClose = () => this.props.history.goBack();

  onSuccess = async payment => {
    // XX TODO
    // await this.addGiftOrder(payment.paymentID);
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
    const gemPackID = getParams(this.props).gempack;
    // const gemPack = await actions.fetchDocGift(gemPackID);
    const gemPack = GEM_PACK;
    const influencerID = getParams(this.props).i;
    const influencer = await actions.fetchDocInfluencerByID(influencerID);
    this.setState({ gemPack, influencer, isLoading: false });
  };

  setInfluencer = async () => {};

  render() {
    const { gemPack, influencer, isLoading, paypalErrorMsg, toConfirmation } = this.state;

    if (isLoading) return <Spinner />;

    if (toConfirmation) return this.goToConfirmation();

    const btnPayPal = (
      <PayPalCheckout
        client={CLIENT}
        commit
        currency={CURRENCY}
        env={ENV}
        description={`Gem pack of ${gemPack.gems} gift for ${influencer.displayName}`}
        onSuccess={this.onSuccess}
        onError={this.onError}
        onCancel={this.onCancel}
        total={gemPack.price}
      />
    );

    const paypalError = paypalErrorMsg ? <Fonts.ERROR>{paypalErrorMsg}</Fonts.ERROR> : null;

    const paymentForm = (
      <div>
        <Content.Row>
          <Fonts.P centered>You'll receive</Fonts.P>
          <Fonts.H3 centered noMargin>
            <Currency.GemsSingle small /> {gemPack.gems}
          </Fonts.H3>
        </Content.Row>
        <Content.Spacing8px />
        <Content.Row>
          <Fonts.P centered>Total price</Fonts.P>
          <Fonts.H3 centered noMargin>
            $ {gemPack.price}
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
      </div>
    );

    return (
      <Content>
        <Content.Spacing16px />
        <Popup.BtnClose handleClose={this.handleClose} />
        <Fonts.H1 centered>Get a Gem Pack to spend on {influencer.displayName}'s prizes</Fonts.H1>
        <Content.Row justifyCenter>
          <GiftImg src={gemPack.imgURL} />
        </Content.Row>
        <Content.Seperator />
        {paymentForm}
      </Content>
    );
  }
}

export default Checkout;
