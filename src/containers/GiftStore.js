import React from 'react';
import { Redirect } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';

import actions from '../data/actions';
import Content from '../components/Content';
import Fonts from '../utils/Fonts';
import GiftRow from '../components/GiftRow';
import GiftImg from '../components/GiftImg';
import { getParams } from '../utils/Helpers';
import Popup from '../components/Popup';
import Spinner from '../components/Spinner';

class GiftStore extends React.Component {
  state = {
    giftOptions: [],
    influencer: {
      id: '',
      storeImgURL: '',
    },
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

  setGiftOptions = async () => {
    const influencerID = this.getInfluencerID();
    const influencer = await actions.fetchDocInfluencerByID(influencerID);
    const giftOptions = await actions.fetchDocsGiftOptions(influencerID);
    const giftOptionsActive = giftOptions.filter(option => option.isActive);
    this.setState({ giftOptions: giftOptionsActive, influencer, isLoading: false });
    mixpanel.track('Visited Gem Store', { influencer: influencer.username });
  };

  render() {
    const { giftOptions, influencer, isLoading, toConfirmation, selectedGiftID } = this.state;

    if (toConfirmation && selectedGiftID) return this.goToConfirmation();

    const giftsDiv = giftOptions
      .sort((a, b) => a.price - b.price)
      .map(option => (
        <GiftRow
          key={option.id}
          handleClick={this.handleGiftCheckout}
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
