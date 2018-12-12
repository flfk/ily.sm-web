import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';

import Content from '../components/Content';
import Currency from '../components/Currency';
import GiftImg from '../components/GiftImg';
import Popup from '../components/Popup';
import Spinner from '../components/Spinner';
import PayPalCheckout from '../components/PayPalCheckout';
import actions from '../data/actions';
import Fonts from '../utils/Fonts';
import { getParams, getTimestamp } from '../utils/Helpers';
import { ITEM_TYPE } from '../utils/Constants';

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
    gemPack: {},
    influencer: {},
    isLoading: true,
    orderID: '',
    paypalErrorMsg: '',
    toConfirmation: false,
  };

  componentDidMount() {
    this.setData();
    mixpanel.track('Visited Checkout');
  }

  addOrderGemPack = async paypalPaymentID => {
    const { gemPack, influencer } = this.state;
    // const txn = await actions.addDocTxn({
    //   changePointsComments: 0,
    //   changePointsPaid: gift.gemsEarned,
    //   influencerID: influencer.id,
    //   timestamp: getTimestamp(),
    //   username: usernameFormatted,
    // });
    const orderNum = await actions.fetchOrderNum();
    const order = {
      gemPackID: gemPack.id,
      paypalFee: this.getPaypalFee(gemPack.price),
      total: gemPack.price,
      // TODO
      // txnID: txn.id,
      orderNum,
      paypalPaymentID,
      type: ITEM_TYPE.gemPack,
      timestamp: getTimestamp(),
      // TODO
      // userID: 'XXTODO'
    };
    const orderAdded = await actions.addDocOrder(order);
    this.setState({ orderID: orderAdded.id, toConfirmation: true });
    mixpanel.track('Purchased Gem Pack', {
      gemPack: gemPack.gems,
      influencer: influencer.username,
      price: gemPack.price,
    });
    mixpanel.people.track_charge(gemPack.price);
  };

  getPaypalFee = price => price * PAYPAL_VARIABLE_FEE + PAYPAL_FIXED_FEE;

  goToConfirmation = () => {
    const { influencer, orderID } = this.state;
    return (
      <Redirect
        push
        to={{
          pathname: '/confirmation',
          search: `?orderID=${orderID}&i=${influencer.id}`,
        }}
      />
    );
  };

  handleClose = () => this.props.history.goBack();

  onSuccess = async payment => {
    // XX TODO
    await this.addOrderGemPack(payment.paymentID);
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
    const { gemPackID, i } = getParams(this.props);
    const gemPack = await actions.fetchDocGemPack(gemPackID);
    const influencer = await actions.fetchDocInfluencerByID(i);
    this.setState({ gemPack, influencer, isLoading: false });
  };

  setInfluencer = async () => {};

  render() {
    const { gemPack, isLoading, paypalErrorMsg, toConfirmation } = this.state;

    if (isLoading) return <Spinner />;

    if (toConfirmation) return this.goToConfirmation();

    const btnPayPal = (
      <PayPalCheckout
        client={CLIENT}
        commit
        currency={CURRENCY}
        env={ENV}
        description={`ily.sm gem pack: ${gemPack.gems} gems`}
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
        <Fonts.H1 centered>Get Gem Pack</Fonts.H1>
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
