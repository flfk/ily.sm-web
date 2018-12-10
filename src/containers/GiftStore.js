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
    toCheckout: false,
    selectedGiftID: '',
  };

  componentDidMount() {
    this.setGiftOptions();
  }

  handleClose = () => this.props.history.goBack();

  handleGiftCheckout = event => {
    const { influencer, giftOptions } = this.state;
    const giftID = event.target.value;
    this.setState({ selectedGiftID: giftID, toCheckout: true });
    const giftSelected = giftOptions.find(option => option.id === giftID);
    mixpanel.track('Selected Gift', { influencer: influencer.username, gift: giftSelected.name });
  };

  getInfluencerID = () => {
    const { i } = getParams(this.props);
    return i;
  };

  goToCheckout = () => {
    const { selectedGiftID } = this.state;
    return (
      <Redirect
        push
        to={{
          pathname: '/checkout',
          search: `?gift=${selectedGiftID}`,
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
    const { giftOptions, influencer, isLoading, toCheckout, selectedGiftID } = this.state;

    if (toCheckout && selectedGiftID) return this.goToCheckout();

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
