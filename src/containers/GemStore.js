import mixpanel from 'mixpanel-browser';
import React from 'react';
import { Redirect } from 'react-router-dom';

import Content from '../components/Content';
import Fonts from '../utils/Fonts';
import GemPackRow from '../components/GemPackRow';
import actions from '../data/actions';
import { GEMS_PER_COMMENT } from '../utils/Constants';
import { getParams } from '../utils/Helpers';
import Popup from '../components/Popup';
import Spinner from '../components/Spinner';

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
    this.setData();
  }

  handleClose = () => this.props.history.goBack();

  handleSelectGemPack = event => {
    const { influencer, gemPacks } = this.state;
    const gemPackSelectedID = event.target.value;
    this.setState({ selectedGemPackID: gemPackSelectedID, toCheckout: true });
    const gemPackSelected = gemPacks.find(pack => pack.id === gemPackSelectedID);
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
          search: `?gemPackID=${selectedGemPackID}&i=${influencer.id}`,
        }}
      />
    );
  };

  setData = async () => {
    const influencerID = this.getInfluencerID();
    const influencer = await actions.fetchDocInfluencerByID(influencerID);
    const gemPacks = await actions.fetchDocsGemPacks();
    const gemPacksActive = gemPacks.filter(pack => pack.isActive);
    this.setState({ gemPacks: gemPacksActive, influencer, isLoading: false });
    mixpanel.track('Visited Gem Store', { influencer: influencer.username });
  };

  render() {
    const { gemPacks, influencer, isLoading, toCheckout, selectedGemPackID } = this.state;

    if (toCheckout && selectedGemPackID) return this.goToCheckout();

    const purchaseOptions = gemPacks
      .sort((a, b) => a.price - b.price)
      .map(pack => (
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
          Earn a <strong>free gem for every {1 / GEMS_PER_COMMENT} comments</strong> on @
          {influencer.username}'s most recent Instagram post
        </Fonts.P>
        <Content.Seperator />
        <Fonts.H1 centered>Buy Gems</Fonts.H1>
        {purchaseOptions}
      </Content>
    );
  }
}

export default GemStore;
