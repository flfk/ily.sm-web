import _ from 'lodash';
import React from 'react';
import { Redirect } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';
import moment from 'moment-timezone';

import actions from '../data/actions';
import Btn from '../components/Btn';
import Content from '../components/Content';
import DashboardRow from '../components/DashboardRow';
import GiftAnimation from '../components/GiftAnimation';
import Spinner from '../components/Spinner';
import Fonts from '../utils/Fonts';
import { getParams } from '../utils/Helpers';

const COMMISSION = 0.15;

class Gift extends React.Component {
  state = {
    gift: [],
    isLoading: true,
    order: {},
    toDashboard: false,
  };

  componentDidMount() {
    this.setData();
  }

  getOrderID = () => {
    const { id } = getParams(this.props);
    return id;
  };

  setData = async () => {
    this.setState({ isLoading: true });
    const orderID = this.getOrderID();
    const order = await actions.fetchDocOrder(orderID);
    const gift = await actions.fetchDocGift(order.giftID);
    this.setState({ gift, isLoading: false, order });
  };

  updateOrders = (orderID, wasThanked) => {
    // actions.updateDocOrder(orderID, orderUpdated);
  };

  render() {
    const { gift, isLoading, order, toDashboard } = this.state;

    console.log(gift, order);

    if (isLoading) {
      return (
        <Content>
          <Fonts.H3 centered>Loading Gift</Fonts.H3>
          <Spinner />
        </Content>
      );
    }

    return (
      <Content>
        <Fonts.H1 centered>{order.username} sent you a gift!</Fonts.H1>
        <GiftAnimation />
        <Fonts.H3>Attached Message</Fonts.H3>
        <Fonts.P>{order.note}</Fonts.P>
        <Content.Spacing />
        <Btn primary>Open Gift</Btn>
      </Content>
    );
  }
}

export default Gift;
