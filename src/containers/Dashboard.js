import _ from 'lodash';
import React from 'react';
import { Redirect } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';
import moment from 'moment-timezone';

import actions from '../data/actions';
import { COMMISSION, GEMS_PER_DOLLAR, GEMS_PER_COMMENT } from '../utils/Constants';
import Content from '../components/Content';
import DashboardRow from '../components/DashboardRow';
import Spinner from '../components/Spinner';
import Fonts from '../utils/Fonts';
import { getFormattedNumber, getParams } from '../utils/Helpers';

import { fetchDocUser } from '../data/redux/user/user.api';

class Dashboard extends React.Component {
  state = {
    items: [],
    isLoading: false,
    influencer: {
      pathname: '',
      id: '',
    },
    orders: [],
    orderIDSelected: '',
    users: [],
  };

  componentDidMount() {
    this.setData();
  }

  getDatedRows = (items, orders) => {
    const { users } = this.state;
    const datedRows = _.chain(orders)
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(order => ({ ...order, date: moment(order.timestamp).format('MMM Do') }))
      .groupBy('date')
      .map((group, date) => {
        const rows = group.map(order => {
          const username = order.userID
            ? users.find(user => user.id === order.userID).username
            : order.username;
          const item = items.find(option => option.id === order.itemID);
          return (
            <DashboardRow
              key={order.id}
              name={item.name}
              username={username}
              handleSelect={this.handleSelectGift}
              handleUndo={this.handleUndo(order.id)}
              wasOpened={order.wasOpened}
              value={order.id}
            />
          );
        });
        return (
          <div key={date}>
            <Fonts.P>{date.toUpperCase()}</Fonts.P>
            <Content.Spacing8px />
            {rows}
            <Content.Spacing16px />
          </div>
        );
      })
      .value();
    return datedRows;
  };

  getInfluencerID = () => {
    const { i } = getParams(this.props);
    return i;
  };

  goToGift = () => {
    const { orders, orderIDSelected, users } = this.state;
    const { userID } = orders.find(order => order.id === orderIDSelected);
    const user = users.find(option => option.id === userID);
    return (
      <Redirect
        push
        to={{
          pathname: '/gift',
          search: `?orderID=${orderIDSelected}&username=${user.username}`,
        }}
      />
    );
  };

  handleSelectGift = event => {
    this.setState({ orderIDSelected: event.target.value });
  };

  handleThankFan = (snapLensURL, orderID) => () => {
    window.open(snapLensURL, '_blank');
    const wasThanked = true;
    this.updateOrders(orderID, wasThanked);
  };

  handleUndo = orderID => () => {
    const wasThanked = false;
    this.updateOrders(orderID, wasThanked);
  };

  setData = async () => {
    this.setState({ isLoading: true });
    const influencerID = this.getInfluencerID();
    const influencer = await actions.fetchDocInfluencerByID(influencerID);
    this.setState({ influencer });
    const items = await actions.fetchDocsItems(influencer.id);
    const orders = await actions.fetchDocsOrders(influencer.id);
    const ordersFiltered = orders.filter(order => !order.isCustom);
    const users = await Promise.all(
      orders.map(async order => {
        let user;
        if (order.userID) {
          user = await fetchDocUser(order.userID);
        } else {
          user = { username: order.username };
        }
        return user;
      })
    );
    this.setState({ items, orders: ordersFiltered, users });
    this.setState({ isLoading: false });
    mixpanel.track('Visited Dashboard', { influencer: influencer.username });
  };

  updateOrders = (orderID, wasThanked) => {
    const { orders } = this.state;
    const orderIndex = orders.map(order => order.id).indexOf(orderID);
    const orderUpdated = { ...orders[orderIndex], wasThanked };
    const ordersUpdated = orders.slice();
    ordersUpdated[orderIndex] = orderUpdated;
    this.setState({ orders: ordersUpdated });
    actions.updateDocOrder(orderID, orderUpdated);
  };

  render() {
    const { items, influencer, isLoading, orders, orderIDSelected } = this.state;

    if (orderIDSelected) return this.goToGift();

    const totalRevenue = orders
      .filter(order => order.wasOpened)
      .reduce((aggr, order) => {
        if (order.purchasedGemsSpent) {
          console.log(order.purchasedGemsSpent);
          return aggr + (order.purchasedGemsSpent / GEMS_PER_DOLLAR) * (1 - COMMISSION);
        }
        return aggr + (order.total - order.paypalFee) * (1 - COMMISSION);
      }, 0);

    // const totalComments = orders
    //   .filter(order => order.wasOpened)
    //   .reduce((aggr, order) => {
    //     if (order.purchasedGemsSpent) {
    //       return aggr + (-1 * order.gemBalanceChange - order.purchasedGemsSpent) / GEMS_PER_COMMENT;
    //     }
    //     return aggr;
    //   }, 0);

    let unopenedGifts = null;
    let openedGifts = null;
    let unopenedGiftsTitle = null;
    let openedGiftsTitle = null;

    if (orders) {
      const unopenedOrders = orders.filter(order => !order.wasOpened);
      const openedOrders = orders.filter(order => order.wasOpened);
      unopenedGifts = this.getDatedRows(items, unopenedOrders);
      openedGifts = this.getDatedRows(items, openedOrders);
      if (unopenedOrders.length > 0) unopenedGiftsTitle = <Fonts.H3>Unopened Gifts</Fonts.H3>;
      if (openedOrders.length > 0) openedGiftsTitle = <Fonts.H3>Opened Gifts</Fonts.H3>;
    }

    if (isLoading) return <Spinner />;

    return (
      <Content>
        <Fonts.H1 centered noMarginBottom>
          {influencer.displayName}'s Dashboard
        </Fonts.H1>
        <Content.Row justifyCenter>
          <Fonts.H2 noMarginBottom centered>
            ${getFormattedNumber(totalRevenue.toFixed(2))}
          </Fonts.H2>
          <Content.Gap />
          <Fonts.P>from opened orders</Fonts.P>
        </Content.Row>
        <Content.Row justifyCenter>
          <Fonts.H2 noMarginBottom centered>
            {orders.length}
          </Fonts.H2>
          <Content.Gap />
          <Fonts.P>orders received</Fonts.P>
        </Content.Row>
        <Content.Spacing16px />
        <Content.Seperator />
        {unopenedGiftsTitle}
        {unopenedGifts}
        {openedGiftsTitle}
        {openedGifts}
      </Content>
    );
  }
}

export default Dashboard;
