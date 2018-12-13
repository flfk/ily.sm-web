import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Btn from '../components/Btn';
import Content from '../components/Content';
import GiftImg from '../components/GiftImg';
import InputText from '../components/InputText';
import Popup from '../components/Popup';
import Spinner from '../components/Spinner';
import actions from '../data/actions';
import { ITEM_TYPE } from '../utils/Constants';
import Fonts from '../utils/Fonts';
import { getParams, getTimestamp } from '../utils/Helpers';

import { getLoggedInUser } from '../data/redux/user/user.actions';

const propTypes = {
  actionGetLoggedInUser: PropTypes.func.isRequired,
  gemBalance: PropTypes.number,
  userID: PropTypes.string,
};

const defaultProps = {
  gemBalance: 0,
  userID: '',
};

const mapStateToProps = state => ({ gemBalance: state.user.gemBalance, userID: state.user.id });

const mapDispatchToProps = dispatch => ({
  actionGetLoggedInUser: user => dispatch(getLoggedInUser(user)),
});

class MessageStore extends React.Component {
  state = {
    influencer: {
      id: '',
      storeImgURL: '',
    },
    item: {},
    message: '',
    messageErrMsg: '',
    messageIsValid: false,
    isLoading: true,
    toInsufficientGems: false,
    toConfirmation: false,
    toSignUp: false,
    orderID: '',
  };

  componentDidMount() {
    this.setData();
  }

  addOrderMessage = async () => {
    const { influencer, item, message } = this.state;
    const { userID } = this.props;
    const orderNum = await actions.fetchOrderNum();
    const order = {
      gemBalanceChange: -1 * item.price,
      itemID: item.id,
      influencerID: influencer.id,
      message,
      orderNum,
      reply: '',
      timestamp: getTimestamp(),
      type: ITEM_TYPE.message,
      userID,
      wasOpened: false,
    };
    const orderAdded = await actions.addDocOrder(order);
    this.setState({ orderID: orderAdded.id, toConfirmation: true });
    mixpanel.track('Ordered Item', { influencer: influencer.username, item: ITEM_TYPE.message });
  };

  handleClose = () => this.props.history.goBack();

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

  goToSignUp = () => (
    <Redirect
      push
      to={{
        pathname: '/signup',
      }}
    />
  );

  goToInsufficientGems = () => {
    const { influencer, item } = this.state;
    return (
      <Redirect
        push
        to={{
          pathname: '/insufficient',
          search: `?i=${influencer.id}&itemID=${item.id}`,
        }}
      />
    );
  };

  handleBlur = field => () => {
    let isValid = false;
    if (field === 'message') isValid = this.isMessageValid();
    const validFieldID = `${field}IsValid`;
    this.setState({ [validFieldID]: isValid });
  };

  handleChangeInput = field => event => this.setState({ [field]: event.target.value });

  handleSendMessage = async () => {
    const { item } = this.state;
    const { actionGetLoggedInUser, gemBalance, userID } = this.props;
    if (!userID) {
      this.setState({ toSignUp: true });
    }
    if (gemBalance < item.price) {
      this.setState({ toInsufficientGems: true });
    } else if (this.isMessageValid() && userID) {
      await this.addOrderMessage();
      actionGetLoggedInUser();
    }
  };

  isMessageValid = () => {
    const { message } = this.state;
    if (message === '') {
      this.setState({ messageErrMsg: "Don't forget to write a message." });
      return false;
    }
    this.setState({ messageErrMsg: '' });
    return true;
  };

  setData = async () => {
    const { i, itemID } = getParams(this.props);
    const influencer = await actions.fetchDocInfluencerByID(i);
    const item = await actions.fetchDocItem(itemID);
    this.setState({ item, influencer, isLoading: false });
    mixpanel.track('Visited Message Store', { influencer: influencer.username });
  };

  render() {
    const {
      influencer,
      isLoading,
      message,
      messageErrMsg,
      messageIsValid,
      toConfirmation,
      toInsufficientGems,
      toSignUp,
      orderID,
    } = this.state;

    if (toConfirmation && orderID) return this.goToConfirmation();
    if (toSignUp) return this.goToSignUp();
    if (toInsufficientGems) return this.goToInsufficientGems();

    if (isLoading) return <Spinner />;

    return (
      <Content>
        <Content.Spacing16px />
        <Popup.BtnClose handleClose={this.handleClose} />
        <Fonts.H1 centered>Send {influencer.displayName} a message and get one back</Fonts.H1>
        <Content.Centered>
          <GiftImg src={influencer.storeImgURL} large />
        </Content.Centered>
        <Content.Spacing />
        <InputText.Area
          errMsg={messageErrMsg}
          label={`What do you want to say to ${influencer.displayName}?`}
          placeholder="Your message"
          onBlur={this.handleBlur('message')}
          onChange={this.handleChangeInput('message')}
          value={message}
          isValid={messageIsValid}
        />
        <Btn primary short onClick={this.handleSendMessage}>
          Send
        </Btn>
      </Content>
    );
  }
}

MessageStore.propTypes = propTypes;
MessageStore.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageStore);
