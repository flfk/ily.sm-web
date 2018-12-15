import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import actions from '../data/actions';
import Btn from '../components/Btn';
import Content from '../components/Content';
import Currency from '../components/Currency';
import Header from '../components/Header';
import { ITEM_TYPE } from '../utils/Constants';
import { getFormattedNumber, getTimestamp, getParams } from '../utils/Helpers';
import Fonts from '../utils/Fonts';
import { Footer, PopupGiftOptions, PopupMessage, PopupVideoCall, Row } from '../components/prizes';
import Spinner from '../components/Spinner';

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

const mapStateToProps = state => ({
  gemBalance: state.user.gemBalance,
  userID: state.user.id,
});

const mapDispatchToProps = dispatch => ({
  actionGetLoggedInUser: user => dispatch(getLoggedInUser(user)),
});

class Prizes extends React.Component {
  state = {
    giftOptions: [],
    influencer: {
      dateUpdateLast: 0,
      displayName: '',
      fandom: '',
      id: '',
      mostRecentImgURL: '',
      username: '',
    },
    items: [],
    isLoading: true,
    orderID: '',
    selectedItemID: '',
    showPopupGifts: false,
    toConfirmation: false,
    toInsufficientGems: false,
    toSignUp: false,
    toStoreGems: false,
    toStoreGifts: false,
    toStoreMessage: false,
  };

  componentDidMount() {
    this.setData();
  }

  addOrder = async (item, additionalFields) => {
    this.setState({ isLoading: true });
    const { influencer } = this.state;
    const { userID } = this.props;
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
    console.log('order added', orderAdded);
    this.setState({ orderID: orderAdded.id, toConfirmation: true });
    mixpanel.track('Ordered Item', { influencer: influencer.username, item: ITEM_TYPE.message });
  };

  fetchInfluencer = async () => {
    const { i } = getParams(this.props);
    const influencer = await actions.fetchDocInfluencerByField('username', i);
    return influencer;
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

  goToStoreGifts = () => {
    const { influencer } = this.state;
    return (
      <Redirect
        push
        to={{
          pathname: '/gifts',
          search: `?i=${influencer.id}`,
        }}
      />
    );
  };

  goToStoreMessage = () => {
    const { influencer, selectedItemID } = this.state;
    return (
      <Redirect
        push
        to={{
          pathname: '/message',
          search: `?i=${influencer.id}&itemID=${selectedItemID}`,
        }}
      />
    );
  };

  goToStoreGems = () => {
    const { influencer } = this.state;
    return (
      <Redirect
        push
        to={{
          pathname: '/gems',
          search: `?i=${influencer.id}`,
        }}
      />
    );
  };

  goToInsufficientGems = () => {
    const { influencer, selectedItemID } = this.state;
    return (
      <Redirect
        push
        to={{
          pathname: '/insufficient',
          search: `?i=${influencer.id}&itemID=${selectedItemID}`,
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

  handleItemOrder = async (item, additionalFields = {}) => {
    const { actionGetLoggedInUser, gemBalance, userID } = this.props;
    if (!userID) {
      this.setState({ toSignUp: true });
    }
    if (gemBalance < item.price) {
      this.setState({ toInsufficientGems: true });
    } else if (userID) {
      await this.addOrder(item, additionalFields);
      actionGetLoggedInUser();
    }
  };

  handleItemSelect = event => {
    const selectedItemID = event.target.value;
    const { items } = this.state;
    const item = items.find(option => option.id === selectedItemID);
    this.setState({ selectedItemID: item.id });

    if (item.type === ITEM_TYPE.gift) {
      this.setState({ showPopupGifts: true });
      return;
    }
    if (item.type === ITEM_TYPE.message) {
      this.setState({ showPopupMessage: true });
      return;
    }
    if (item.type === ITEM_TYPE.videoCall) {
      this.setState({ showPopupVideoCall: true });
      return;
    }
    this.handleItemOrder(item);
  };

  handlePopupClose = popupName => {
    const key = `showPopup${popupName}`;
    return () => this.setState({ [key]: false });
  };

  handleSelectStore = type => () => {
    if (type === ITEM_TYPE.gemPack) {
      this.setState({ toStoreGems: true });
    }
  };

  isOrderValid = () => {};

  setData = async () => {
    const influencer = await this.fetchInfluencer();
    this.setState({ influencer });
    const items = await actions.fetchDocsItems(influencer.id);
    const itemsActive = items.filter(item => item.isActive);
    this.setState({ items: itemsActive, isLoading: false });
    mixpanel.track('Visited Prizes', { influencer: influencer.username });
  };

  render() {
    const {
      influencer,
      items,
      isLoading,
      selectedItemID,
      showPopupGifts,
      showPopupMessage,
      showPopupVideoCall,
      toConfirmation,
      toInsufficientGems,
      toSignUp,
      toStoreGems,
      orderID,
    } = this.state;

    const { gemBalance, userID } = this.props;

    if (toConfirmation && orderID) return this.goToConfirmation();
    if (toSignUp) return this.goToSignUp();
    if (toInsufficientGems && selectedItemID) return this.goToInsufficientGems();

    if (toStoreGems) return this.goToStoreGems();

    if (isLoading) return <Spinner />;

    const wallet = userID ? (
      <Content.Row alignTop>
        <div>
          <Fonts.P isSupporting>YOUR BALANCE</Fonts.P>
          <Fonts.H3 noMargin>
            {getFormattedNumber(gemBalance.toFixed(0))} <Currency.GemsSingle small />
          </Fonts.H3>
        </div>
        <Btn.Tertiary onClick={this.handleSelectStore(ITEM_TYPE.gemPack)}>
          Get More Gems
        </Btn.Tertiary>
      </Content.Row>
    ) : null;

    const itemRows = items
      .filter(item => item.type !== ITEM_TYPE.gift)
      .map(item => (
        <Row
          key={item.id}
          imgURL={item.imgURL}
          handleClick={this.handleItemSelect}
          name={item.name}
          price={item.price}
          value={item.id}
        />
      ));

    const giftOptions = items.filter(option => option.type === ITEM_TYPE.gift);
    const cheapestGift = giftOptions.sort((a, b) => a.price - b.price)[0] || null;
    const giftRow = cheapestGift ? (
      <Row
        imgURL={cheapestGift.imgURL}
        handleClick={this.handleItemSelect}
        name={`Send ${influencer.displayName} a gift`}
        price={cheapestGift.price}
        value={cheapestGift.id}
      />
    ) : null;

    const footer = userID ? null : (
      <div>
        <Content.Spacing />
        <Content.Spacing />
        <Content.Spacing />
        <Footer influencerName={influencer.displayName} redirectPathname="signup">
          Footer
        </Footer>
      </div>
    );

    const popupGiftOptions = showPopupGifts ? (
      <PopupGiftOptions
        giftOptions={giftOptions}
        handleClose={this.handlePopupClose('Gifts')}
        handleItemOrder={this.handleItemOrder}
        influencer={influencer}
      />
    ) : null;

    const messageItem = items.find(item => item.id === selectedItemID);
    const popupMessage =
      showPopupMessage && messageItem ? (
        <PopupMessage
          item={messageItem}
          handleClose={this.handlePopupClose('Message')}
          handleItemOrder={this.handleItemOrder}
          influencer={influencer}
        />
      ) : null;

    const videoCallItem = items.find(item => item.id === selectedItemID);
    const popupVideoCall =
      showPopupVideoCall && videoCallItem ? (
        <PopupVideoCall
          item={videoCallItem}
          handleClose={this.handlePopupClose('VideoCall')}
          handleItemOrder={this.handleItemOrder}
          influencer={influencer}
        />
      ) : null;

    return (
      <div>
        <Content>
          <Header
            fandom={influencer.fandom}
            profilePicURL={influencer.profilePicURL}
            selectedScreen="Prizes"
            username={influencer.username}
          />
          {wallet}
          <Fonts.H3 centered>What do you want from @{influencer.username}?</Fonts.H3>
          {itemRows}
          {giftRow}
          <Content.Spacing />
        </Content>
        {footer}
        {popupGiftOptions}
        {popupMessage}
        {popupVideoCall}
      </div>
    );
  }
}

Prizes.propTypes = propTypes;
Prizes.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Prizes);
