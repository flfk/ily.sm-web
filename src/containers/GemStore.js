import React from 'react';
import { Redirect } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';

import actions from '../data/actions';
import Content from '../components/Content';
import Fonts from '../utils/Fonts';
import GemPackRow from '../components/GemPackRow';
import { getParams } from '../utils/Helpers';
import Popup from '../components/Popup';
import Spinner from '../components/Spinner';

const GEM_PACKS = [
  {
    gems: 10,
    id: 'abc123',
    imgURL:
      'https://firebasestorage.googleapis.com/v0/b/ilysm-15824.appspot.com/o/gemPacks%2FGem3.png?alt=media&token=599883f4-1870-463e-a1c1-e2e136fb01c2',
    price: 9.99,
  },
];

class GemStore extends React.Component {
  state = {
    gemPacks: [],
    influencer: {
      id: '',
      storeImgURL: '',
    },
    isLoading: true,
    toCheckout: false,
    selectedGemPackID: '',
  };

  componentDidMount() {
    this.setGiftOptions();
  }

  handleClose = () => this.props.history.goBack();

  handleSelectGemPack = event => {
    const { influencer } = this.state;
    const gemPackID = event.target.value;
    this.setState({ selectedGemPackID: gemPackID, toCheckout: true });
    const gemPackSelected = GEM_PACKS.find(option => option.id === gemPackID);
    mixpanel.track('Selected Gem Pack', {
      influencer: influencer.username,
      gemPack: gemPackSelected.gems,
      price: gemPackSelected.price,
    });
  };

  getInfluencerID = () => {
    const { i } = getParams(this.props);
    return i;
  };

  goToCheckout = () => {
    const { influencer, selectedGemPackID } = this.state;
    return (
      <Redirect
        push
        to={{
          pathname: '/checkout',
          search: `?gempack=${selectedGemPackID}&i=${influencer.id}`,
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
    const { influencer, isLoading, toCheckout, selectedGemPackID } = this.state;

    if (toCheckout && selectedGemPackID) return this.goToCheckout();

    const purchaseOptions = GEM_PACKS.sort((a, b) => a.price - b.price).map(pack => (
      <GemPackRow
        key={pack.id}
        gemPackID={pack.id}
        handleClick={this.handleSelectGemPack}
        imgURL={pack.imgURL}
        name={`${pack.gems} gems`}
        price={pack.price}
      />
    ));

    if (isLoading) return <Spinner />;

    return (
      <Content>
        <Content.Spacing16px />
        <Popup.BtnClose handleClose={this.handleClose} />
        <Fonts.H1 centered>Earn Free Gems</Fonts.H1>
        <Fonts.P centered>
          Earn a free gem for every 100 comments on {influencer.displayName}'s most recent Instagram
          post
        </Fonts.P>
        <Content.Seperator />
        <Fonts.H1 centered>Buy Gems</Fonts.H1>
        <Content.Spacing />
        {purchaseOptions}
      </Content>
    );
  }
}

export default GemStore;
