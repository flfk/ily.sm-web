import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Content from '../components/Content';
import GiftImg from '../components/GiftImg';
import Popup from '../components/Popup';
import Spinner from '../components/Spinner';
import PayPalCheckout from '../components/PayPalCheckout';
import actions from '../data/actions';
import Fonts from '../utils/Fonts';
import { getParams, getTimestamp } from '../utils/Helpers';
import { ITEM_TYPE } from '../utils/Constants';

import { getLoggedInUser } from '../data/redux/user/user.actions';

const CLIENT = {
  sandbox: process.env.REACT_APP_PAYPAL_CLIENT_ID_SANDBOX,
  production: process.env.REACT_APP_PAYPAL_CLIENT_ID_PRODUCTION,
};
const ENV = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox';
const CURRENCY = 'USD';

const PAYPAL_VARIABLE_FEE = 0.036;
const PAYPAL_FIXED_FEE = 0.3;

const propTypes = {
  actionGetLoggedInUser: PropTypes.func.isRequired,
  userID: PropTypes.string,
};

const defaultProps = {
  userID: '',
};

const mapStateToProps = state => ({ userID: state.user.id });

const mapDispatchToProps = dispatch => ({
  actionGetLoggedInUser: () => dispatch(getLoggedInUser()),
});

class Checkout extends React.Component {
  state = {
    gemPack: {},
    influencer: {},
    isLoading: true,
    paypalErrorMsg: '',
    toPrizes: false,
  };

  componentDidMount() {
    this.setData();
    mixpanel.track('Visited Checkout');
  }

  addOrderGemPack = async paypalPaymentID => {
    const { gemPack, influencer } = this.state;
    const { userID } = this.props;
    const orderNum = await actions.fetchOrderNum();
    const order = {
      gemBalanceChange: gemPack.gems,
      gemPackID: gemPack.id,
      paypalFee: this.getPaypalFee(gemPack.price),
      total: gemPack.price,
      orderNum,
      paypalPaymentID,
      type: ITEM_TYPE.gemPack,
      timestamp: getTimestamp(),
      userID,
    };
    await actions.addDocOrder(order);
    this.setState({ toPrizes: true });
    mixpanel.track('Purchased Gem Pack', {
      gemPack: gemPack.gems,
      influencer: influencer.username,
      price: gemPack.price,
    });
    mixpanel.people.track_charge(gemPack.price);
  };

  getPaypalFee = price => price * PAYPAL_VARIABLE_FEE + PAYPAL_FIXED_FEE;

  goToPrizes = () => {
    const { influencer } = this.state;
    return (
      <Redirect
        push
        to={{
          pathname: '/prizes',
          search: `?i=${influencer.id}`,
        }}
      />
    );
  };

  handleClose = () => this.props.history.goBack();

  onSuccess = async payment => {
    const { actionGetLoggedInUser } = this.props;
    await this.addOrderGemPack(payment.paymentID);
    actionGetLoggedInUser();
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

  render() {
    const { gemPack, isLoading, paypalErrorMsg, toPrizes } = this.state;

    if (isLoading) return <Spinner />;

    if (toPrizes) return this.goToPrizes();

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
        <Content.Spacing8px />
        <Content.Row justifyCenter>
          <Fonts.H3 centered noMargin>
            $ {gemPack.price}
          </Fonts.H3>
        </Content.Row>
        <Content.Spacing />
        {paypalError}
        {btnPayPal}
        <Content.Spacing8px />
      </div>
    );

    return (
      <Content>
        <Content.Spacing16px />
        <Popup.BtnClose handleClose={this.handleClose} />
        <Fonts.H1 centered>Get {gemPack.gems} Gems</Fonts.H1>
        <Content.Row justifyCenter>
          <GiftImg src={gemPack.imgURL} />
        </Content.Row>
        {paymentForm}
      </Content>
    );
  }
}

Checkout.propTypes = propTypes;
Checkout.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Checkout);
