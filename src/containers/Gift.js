import React from 'react';

import actions from '../data/actions';
import Btn from '../components/Btn';
import { COMMISSION } from '../utils/Constants';
import Content from '../components/Content';
import Footer from '../components/Footer';
import GiftAnimation from '../components/GiftAnimation';
import Spinner from '../components/Spinner';
import Fonts from '../utils/Fonts';
import { getParams } from '../utils/Helpers';
import Popup from '../components/Popup';

const ANIMATION_LENGTH_MILLIS = 4000;
const TIMER_INTERVAL_MILLIS = 500;

class Gift extends React.Component {
  state = {
    animationMillisRemaining: ANIMATION_LENGTH_MILLIS,
    gift: {
      name: '',
    },
    isBeingOpened: false,
    isLoading: true,
    order: {
      wasOpened: false,
    },
  };

  componentDidMount() {
    this.setData();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getOrderID = () => {
    const { id } = getParams(this.props);
    return id;
  };

  handleClose = () => this.props.history.goBack();

  handleGiftOpen = () => {
    const { order } = this.state;
    const orderUpdated = { ...order, wasOpened: true };
    this.setState({ order: orderUpdated, isBeingOpened: true });
    this.interval = setInterval(this.timer, TIMER_INTERVAL_MILLIS);
    this.updateOrder(orderUpdated);
  };

  handleSnapLens = () => {
    console.log('opening Lens');
    const { gift } = this.state;
    window.open(gift.snapLensURL, '_blank');
  };

  setData = async () => {
    this.setState({ isLoading: true });
    const orderID = this.getOrderID();
    const order = await actions.fetchDocOrder(orderID);
    const gift = await actions.fetchDocGift(order.giftID);
    this.setState({ gift, isLoading: false, order });
  };

  timer = () => {
    const { animationMillisRemaining } = this.state;
    if (animationMillisRemaining === 0) {
      this.stopTimer();
      this.setState({ isBeingOpened: false });
    } else {
      this.setState({ animationMillisRemaining: animationMillisRemaining - TIMER_INTERVAL_MILLIS });
    }
  };

  stopTimer = () => {
    clearInterval(this.interval);
  };

  updateOrder = order => {
    actions.updateDocOrder(order.id, order);
  };

  render() {
    const { gift, isBeingOpened, isLoading, order } = this.state;

    if (isLoading) {
      return (
        <Content>
          <Fonts.H3 centered>Loading Gift</Fonts.H3>
          <Spinner />
        </Content>
      );
    }

    const giftName = order.wasOpened && !isBeingOpened ? `${gift.prefix} ${gift.name}` : 'a gift';

    const giftValue = isBeingOpened ? null : (
      <div>
        <Fonts.H3>Gift Value</Fonts.H3>
        <Fonts.P>$ {(order.total - order.paypalFee) * (1 - COMMISSION)}</Fonts.P>
        <Content.Spacing />
      </div>
    );

    const note = isBeingOpened ? null : (
      <div>
        <Fonts.H3>Attached Message</Fonts.H3>
        <Fonts.P>{order.note}</Fonts.P>
      </div>
    );

    let btnPrimary = order.wasOpened ? (
      <Btn primary onClick={this.handleSnapLens}>
        Record Thank Yous
      </Btn>
    ) : (
      <Btn primary onClick={this.handleGiftOpen}>
        Open Gift
      </Btn>
    );
    if (isBeingOpened) btnPrimary = null;

    const footer = isBeingOpened ? null : (
      <Footer>
        <Content>
          <Content.Spacing8px />
          {btnPrimary}
          <Content.Spacing8px />
        </Content>
      </Footer>
    );

    return (
      <div>
        <Content>
          <Content.Spacing16px />
          <Popup.BtnClose handleClose={this.handleClose} />
          <Fonts.H1 centered>
            {order.username} sent you {giftName}!
          </Fonts.H1>
          <GiftAnimation
            wasOpened={order.wasOpened}
            isBeingOpened={isBeingOpened}
            imgURL={gift.imgURL}
          />
          {note}
          {giftValue}
          <Content.Spacing />
          <Content.Spacing />
        </Content>
        {footer}
      </div>
    );
  }
}

export default Gift;
