import React from 'react';
import { Redirect } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';

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
    toConfirmation: false,
    orderID: '',
  };

  componentDidMount() {
    this.setGiftOptions();
  }

  addOrderMessage = async () => {
    const { influencer, item, message } = this.state;
    // XX TODO
    const orderNum = await actions.fetchOrderNum();
    const order = {
      itemID: item.id,
      influencerID: influencer.id,
      total: item.price,
      // XX TODO
      // txnID: txn.id,
      // creditsEarned:
      // creditsPurchased:
      message,
      orderNum,
      reply: '',
      timestamp: getTimestamp(),
      type: ITEM_TYPE.message,
      // XX TODO
      // userID: 'TODO',
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

  handleBlur = field => () => {
    let isValid = false;
    if (field === 'message') isValid = this.isMessageValid();
    const validFieldID = `${field}IsValid`;
    this.setState({ [validFieldID]: isValid });
  };

  handleChangeInput = field => event => this.setState({ [field]: event.target.value });

  handleSendMessage = () => {
    if (this.isMessageValid()) {
      this.addOrderMessage();
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

  setGiftOptions = async () => {
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
      orderID,
    } = this.state;

    if (toConfirmation && orderID) return this.goToConfirmation();

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

export default MessageStore;
