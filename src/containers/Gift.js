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

  handleURL = customURL => () => window.open(customURL, '_blank');

  handleClose = () => this.props.history.goBack();

  handleGiftOpen = () => {
    const { order } = this.state;
    const orderUpdated = { ...order, wasOpened: true };
    this.setState({ order: orderUpdated, isBeingOpened: true });
    this.interval = setInterval(this.timer, TIMER_INTERVAL_MILLIS);
    this.updateOrder(orderUpdated);
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

    const customFields =
      order.wasOpened && !isBeingOpened && order.isCustom ? (
        <div>
          <Content.Row alignCenter>
            <Fonts.H3>{order.customName}</Fonts.H3>
            <Btn narrow short onClick={this.handleURL(order.customURL)}>
              Open Link
            </Btn>
          </Content.Row>
          <Content.Seperator />
        </div>
      ) : null;

    const giftName = order.wasOpened && !isBeingOpened ? `${gift.prefix} ${gift.name}` : 'a gift';

    const giftValue =
      !order.wasOpened || isBeingOpened ? null : (
        <div>
          <Fonts.H3>Gift Value</Fonts.H3>
          <Fonts.P>$ {((order.total - order.paypalFee) * (1 - COMMISSION)).toFixed(2)}</Fonts.P>
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
      <Btn primary onClick={this.handleURL(gift.snapLensURL)}>
        Record Thank You
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

    if (isLoading) return <Spinner />;

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
          {customFields}
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
