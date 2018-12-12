import React from 'react';
import { Redirect } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';

import actions from '../data/actions';
import Content from '../components/Content';
import GiftRow from '../components/GiftRow';
import GiftImg from '../components/GiftImg';
import Popup from '../components/Popup';
import Spinner from '../components/Spinner';
import { ITEM_TYPE } from '../utils/Constants';
import Fonts from '../utils/Fonts';
import { getParams, getTimestamp } from '../utils/Helpers';

class GiftStore extends React.Component {
  state = {
    giftOptions: [],
    influencer: {
      id: '',
      storeImgURL: '',
    },
    isLoading: true,
    toConfirmation: false,
    orderID: '',
  };

  componentDidMount() {
    this.setGiftOptions();
  }

  addOrder = async selectedGiftID => {
    const { giftOptions, influencer } = this.state;
    const gift = giftOptions.find(option => option.id === selectedGiftID);
    // XX TODO
    const orderNum = await actions.fetchOrderNum();
    const order = {
      giftID: selectedGiftID,
      influencerID: influencer.id,
      total: gift.price,
      // XX TODO
      // txnID: txn.id,
      // creditsEarned:
      // creditsPurchased:
      orderNum,
      timestamp: getTimestamp(),
      type: ITEM_TYPE.gift,
      // XX TODO
      // userID: 'TODO',
      wasOpened: false,
    };
    const orderAdded = await actions.addDocOrder(order);
    this.setState({ orderID: orderAdded.id, toConfirmation: true });
    mixpanel.track('Ordered Item', { influencer: influencer.username, item: ITEM_TYPE.message });
  };

  handleClose = () => this.props.history.goBack();

  handleGiftSelect = event => {
    const selectedGiftID = event.target.value;
    this.addOrder(selectedGiftID);
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
          search: `?orderID=${orderID}`,
        }}
      />
    );
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
    const { giftOptions, influencer, isLoading, toConfirmation, orderID } = this.state;

    if (toConfirmation && orderID) return this.goToConfirmation();

    const giftsDiv = giftOptions
      .sort((a, b) => a.price - b.price)
      .map(option => (
        <GiftRow
          key={option.id}
          handleClick={this.handleGiftSelect}
          imgURL={option.imgURL}
          price={option.price}
          gemsEarned={option.gemsEarned}
          giftID={option.id}
          name={option.name}
        />
      ));

    if (isLoading) return <Spinner />;

    return (
      <Content>
        <Content.Spacing16px />
        <Popup.BtnClose handleClose={this.handleClose} />
        <Fonts.H1 centered>What gift do you want to send {influencer.displayName}? </Fonts.H1>
        <Content.Centered>
          <GiftImg src={influencer.storeImgURL} large />
        </Content.Centered>
        <Content.Spacing />
        {giftsDiv}
      </Content>
    );
  }
}

export default GiftStore;
