import React from 'react';

import actions from '../data/actions';
import Btn from '../components/Btn';
import { COMMISSION, GEMS_PER_DOLLAR, GEMS_PER_COMMENT } from '../utils/Constants';
import Content from '../components/Content';
import Footer from '../components/Footer';
import GiftAnimation from '../components/GiftAnimation';
import Spinner from '../components/Spinner';
import Fonts from '../utils/Fonts';
import { getFormattedNumber, getParams } from '../utils/Helpers';
import Popup from '../components/Popup';

const ANIMATION_LENGTH_MILLIS = 4000;
const TIMER_INTERVAL_MILLIS = 500;

class Gift extends React.Component {
  state = {
    animationMillisRemaining: ANIMATION_LENGTH_MILLIS,
    item: {
      name: '',
    },
    isBeingOpened: false,
    isLoading: true,
    order: {
      wasOpened: false,
    },
    username: '',
  };

  componentDidMount() {
    this.setData();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

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
    const { orderID, username } = getParams(this.props);
    const order = await actions.fetchDocOrder(orderID);
    const item = await actions.fetchDocItem(order.itemID);
    this.setState({ item, isLoading: false, order, username });
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
    const { item, isBeingOpened, isLoading, order, username } = this.state;

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

    const itemName = order.wasOpened && !isBeingOpened ? `${item.prefix} ${item.name}` : 'a gift';

    const dollarsEarned = order.purchasedGemsSpent
      ? (order.purchasedGemsSpent / GEMS_PER_DOLLAR) * (1 - COMMISSION)
      : (order.total - order.paypalFee) * (1 - COMMISSION);

    const commentsEarned = order.purchasedGemsSpent
      ? (-1 * order.gemBalanceChange - order.purchasedGemsSpent) / GEMS_PER_COMMENT
      : 0;

    const paymentMethod = commentsEarned ? (
      <Fonts.H3 centered noMarginTop>
        $ {dollarsEarned.toFixed(2)} + {getFormattedNumber(commentsEarned)} comments
      </Fonts.H3>
    ) : (
      <Fonts.H3 centered noMarginTop>
        $ {dollarsEarned.toFixed(2)}
      </Fonts.H3>
    );

    const itemValue =
      !order.wasOpened || isBeingOpened ? null : (
        <div>
          <Fonts.P centered>Paid using</Fonts.P>
          <Content.Spacing8px />
          {paymentMethod}
          <Content.Spacing />
        </div>
      );

    const note =
      !order.note || isBeingOpened ? null : (
        <div>
          <Fonts.H3>Attached Message</Fonts.H3>
          <Fonts.P>{order.note}</Fonts.P>
          <Content.Spacing />
        </div>
      );

    let btnPrimary = order.wasOpened ? (
      <Btn primary onClick={this.handleURL(item.snapLensURL)}>
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
            {username} sent you {itemName}!
          </Fonts.H1>
          <GiftAnimation
            wasOpened={order.wasOpened}
            isBeingOpened={isBeingOpened}
            imgURL={item.imgURL}
          />
          {customFields}
          {note}
          {itemValue}
          <Content.Spacing />
          <Content.Spacing />
        </Content>
        {footer}
      </div>
    );
  }
}

export default Gift;
