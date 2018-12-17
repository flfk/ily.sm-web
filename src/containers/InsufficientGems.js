import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import Content from '../components/Content';
import GiftImg from '../components/GiftImg';
import Spinner from '../components/Spinner';
import PayPalCheckout from '../components/PayPalCheckout';
import Popup from '../components/Popup';
import actions from '../data/actions';
import { GEMS_PER_COMMENT, ITEM_TYPE } from '../utils/Constants';
import Fonts from '../utils/Fonts';
import { getFormattedNumber, getParams, getTimestamp } from '../utils/Helpers';

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
  gemBalance: PropTypes.number,
  userID: PropTypes.string,
};

const defaultProps = {
  gemBalance: 0,
  userID: '',
};

const mapStateToProps = state => ({
  gemBalance: state.user.gemBalance,
  userID: state.user.id,
});

const mapDispatchToProps = dispatch => ({
  actionGetLoggedInUser: () => dispatch(getLoggedInUser()),
});

class InsufficientGems extends React.Component {
  state = {
    gemPackSuggested: {},
    item: {},
    influencer: {},
    isLoading: true,
    message: '',
    orderID: '',
    paypalErrorMsg: '',
    toConfirmation: false,
  };

  componentDidMount() {
    this.setData();
  }

  addOrder = async item => {
    const { influencer, message } = this.state;
    const { userID } = this.props;
    const additionalFields = item.type === ITEM_TYPE.message ? { message, reply: '' } : {};
    const orderNum = await actions.fetchOrderNum();
    const order = {
      gemBalanceChange: -1 * item.price,
      itemID: item.id,
      influencerID: influencer.id,
      orderNum,
      timestamp: getTimestamp(),
      type: item.type,
      userID,
      wasOpened: false,
    };
    const orderAdded = await actions.addDocOrder({ ...order, ...additionalFields });
    this.setState({ orderID: orderAdded.id, toConfirmation: true });
    mixpanel.track('Ordered Item', { influencer: influencer.username, item: item.type });
  };

  addOrderGemPack = async paypalPaymentID => {
    const { gemPackSuggested, influencer } = this.state;
    const { userID } = this.props;
    const orderNum = await actions.fetchOrderNum();
    const order = {
      gemBalanceChange: gemPackSuggested.gems,
      gemPackID: gemPackSuggested.id,
      paypalFee: this.getPaypalFee(gemPackSuggested.price),
      total: gemPackSuggested.price,
      orderNum,
      paypalPaymentID,
      type: ITEM_TYPE.gemPack,
      timestamp: getTimestamp(),
      userID,
    };
    await actions.addDocOrder(order);
    mixpanel.track('Purchased Suggested Gem Pack', {
      gemPack: gemPackSuggested.gems,
      influencer: influencer.username,
      price: gemPackSuggested.price,
    });
    mixpanel.people.track_charge(gemPackSuggested.price);
  };

  getPaypalFee = price => price * PAYPAL_VARIABLE_FEE + PAYPAL_FIXED_FEE;

  goToConfirmation = () => {
    const { orderID } = this.state;
    return (
      <Redirect
        push
        to={{
          pathname: '/confirmation',
          search: `?orderID=${orderID}`,
        }}
      />
    );
  };

  setData = async () => {
    const { gemBalance } = this.props;
    const { i, itemID, message } = getParams(this.props);
    const item = await actions.fetchDocItem(itemID);
    const influencer = await actions.fetchDocInfluencerByID(i);
    if (message) {
      this.setState({ message });
    }
    const gemsRequired = item.price - gemBalance;
    const gemPacks = await actions.fetchDocsGemPacks();
    const gemPacksActive = gemPacks.filter(pack => pack.isActive);
    const gemPackLargest = gemPacksActive.sort((a, b) => b.gems - a.gems)[0];
    const gemPackSuggested =
      gemPacksActive.sort((a, b) => a.gems - b.gems).find(pack => pack.gems > gemsRequired) ||
      gemPackLargest;

    this.setState({ gemPackSuggested, influencer, item, isLoading: false });
    mixpanel.track('Visited Insufficient Gems Page', {
      influencer: influencer.username,
      item: item.name,
    });
  };

  onSuccess = async payment => {
    this.setState({ isLoading: true });
    const { item } = this.state;
    const { actionGetLoggedInUser } = this.props;
    await this.addOrderGemPack(payment.paymentID);
    await this.addOrder(item);
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

  render() {
    const {
      gemPackSuggested,
      isLoading,
      item,
      influencer,
      orderID,
      paypalErrorMsg,
      toConfirmation,
    } = this.state;

    const { gemBalance } = this.props;

    if (toConfirmation && orderID) return this.goToConfirmation();

    if (isLoading) return <Spinner />;

    const gemsRequired = item.price - gemBalance;
    const commentsRequired = (gemsRequired / GEMS_PER_COMMENT).toFixed(0);

    const btnPayPal = (
      <PayPalCheckout
        client={CLIENT}
        commit
        currency={CURRENCY}
        env={ENV}
        description={`ily.sm gem pack: ${gemPackSuggested.gems} gems`}
        onSuccess={this.onSuccess}
        onError={this.onError}
        onCancel={this.onCancel}
        total={gemPackSuggested.price}
      />
    );

    const paypalError = paypalErrorMsg ? <Fonts.ERROR>{paypalErrorMsg}</Fonts.ERROR> : null;

    return (
      <Content>
        <Content.Spacing16px />
        <Link to={`/prizes?i=${influencer.username}`}>
          <Popup.BtnClose handleClose={this.handleClose} />
        </Link>
        <Fonts.H3 centered>Get more gems to get a {item.name}.</Fonts.H3>
        <Content.Centered>
          <GiftImg src={item.imgURL} large />
        </Content.Centered>
        <Content.Seperator />
        <Fonts.H3 centered>Earn free gems</Fonts.H3>
        <Fonts.P centered>
          Comment <strong>{getFormattedNumber(commentsRequired)} more times</strong> on @
          {influencer.username}'s most recent post to earn enough free gems.
        </Fonts.P>
        <Content.Seperator />
        <Fonts.H3 centered>Buy gems needed and get a {item.name}</Fonts.H3>
        <Content.Centered>
          <GiftImg src={gemPackSuggested.imgURL} />
        </Content.Centered>
        <Content.Spacing8px />
        <Fonts.P centered>{gemPackSuggested.gems} gems</Fonts.P>
        <Content.Spacing8px />
        <Fonts.P centered>
          <strong>${gemPackSuggested.price}</strong>
        </Fonts.P>
        <Content.Spacing16px />
        {paypalError}
        {btnPayPal}
        <Content.Spacing />
      </Content>
    );
  }
}

InsufficientGems.propTypes = propTypes;
InsufficientGems.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InsufficientGems);
