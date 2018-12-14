import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import actions from '../data/actions';
import Content from '../components/Content';
import GiftRow from '../components/GiftRow';
import GiftImg from '../components/GiftImg';
import Popup from '../components/Popup';
import Spinner from '../components/Spinner';
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

class GiftStore extends React.Component {
  state = {
    giftOptions: [],
    influencer: {
      id: '',
      storeImgURL: '',
    },
    isLoading: true,
    orderID: '',
    toConfirmation: false,
    toInsufficientGems: false,
    selectedGiftID: '',
  };

  componentDidMount() {
    this.setGiftOptions();
  }

  addOrderGift = async selectedGiftID => {
    const { giftOptions, influencer } = this.state;
    const { userID } = this.props;
    const gift = giftOptions.find(option => option.id === selectedGiftID);
    // XX TODO
    const orderNum = await actions.fetchOrderNum();
    const order = {
      gemBalanceChange: -1 * gift.price,
      giftID: selectedGiftID,
      influencerID: influencer.id,
      orderNum,
      timestamp: getTimestamp(),
      type: ITEM_TYPE.gift,
      userID,
      wasOpened: false,
    };
    const orderAdded = await actions.addDocOrder(order);
    this.setState({ orderID: orderAdded.id, toConfirmation: true });
    mixpanel.track('Ordered Item', { influencer: influencer.username, item: ITEM_TYPE.gift });
  };

  handleClose = () => this.props.history.goBack();

  handleGiftSelect = async event => {
    const selectedGiftID = event.target.value;
    this.setState({ selectedGiftID });
    const { giftOptions } = this.state;
    const { actionGetLoggedInUser, gemBalance, userID } = this.props;

    const gift = giftOptions.find(option => option.id === selectedGiftID);
    if (!userID) {
      this.setState({ toSignUp: true });
    }
    if (gemBalance < gift.price) {
      this.setState({ toInsufficientGems: true });
    } else if (userID) {
      await this.addOrderGift(selectedGiftID);
      actionGetLoggedInUser();
    }
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

  goToInsufficientGems = () => {
    const { influencer, selectedGiftID } = this.state;
    return (
      <Redirect
        push
        to={{
          pathname: '/insufficient',
          search: `?i=${influencer.id}&giftID=${selectedGiftID}`,
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
      giftOptions,
      influencer,
      isLoading,
      orderID,
      toConfirmation,
      toInsufficientGems,
      toSignUp,
      selectedGiftID,
    } = this.state;

    if (toConfirmation && orderID) return this.goToConfirmation();
    if (toSignUp) return this.goToSignUp();
    if (toInsufficientGems && selectedGiftID) return this.goToInsufficientGems();

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

GiftStore.propTypes = propTypes;
GiftStore.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GiftStore);
