import React from 'react';
import { Redirect } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';

import actions from '../data/actions';
import Btn from '../components/Btn';
import Content from '../components/Content';
import Fonts from '../utils/Fonts';
import GiftImg from '../components/GiftImg';
import InputText from '../components/InputText';
import { getParams } from '../utils/Helpers';
import Popup from '../components/Popup';
import Spinner from '../components/Spinner';

class MessageStore extends React.Component {
  state = {
    influencer: {
      id: '',
      storeImgURL: '',
    },
    message: '',
    messageErrMsg: '',
    messageIsValid: false,
    isLoading: true,
    toConfirmation: false,
    selectedGiftID: '',
    orderID: '',
  };

  componentDidMount() {
    this.setGiftOptions();
  }

  handleClose = () => this.props.history.goBack();

  handleGiftCheckout = event => {
    const { influencer, giftOptions } = this.state;
    const giftID = event.target.value;
    this.setState({ selectedGiftID: giftID, toConfirmation: true });
    const giftSelected = giftOptions.find(option => option.id === giftID);
    mixpanel.track('Selected Gift', { influencer: influencer.username, gift: giftSelected.name });
  };

  getInfluencerID = () => {
    const { i } = getParams(this.props);
    return i;
  };

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

  handleBlur = field => () => {
    let isValid = false;
    if (field === 'message') isValid = this.isMessageValid();
    const validFieldID = `${field}IsValid`;
    this.setState({ [validFieldID]: isValid });
  };

  handleChangeInput = field => event => this.setState({ [field]: event.target.value });

  handleSendMessage = () => {
    console.log('Sending Message, need to enable');
    if (this.isMessageValid()) {
      this.setState({ toConfirmation: true });
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
    const influencerID = this.getInfluencerID();
    const influencer = await actions.fetchDocInfluencerByID(influencerID);
    const giftOptions = await actions.fetchDocsGiftOptions(influencerID);
    const giftOptionsActive = giftOptions.filter(option => option.isActive);
    this.setState({ giftOptions: giftOptionsActive, influencer, isLoading: false });
    mixpanel.track('Visited Gem Store', { influencer: influencer.username });
  };

  render() {
    const {
      influencer,
      isLoading,
      message,
      messageErrMsg,
      messageIsValid,
      toConfirmation,
      selectedGiftID,
    } = this.state;

    if (toConfirmation && message) return this.goToConfirmation();

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
