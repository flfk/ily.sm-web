import _ from 'lodash';
import React from 'react';
import moment from 'moment-timezone';

import actions from '../data/actions';
import Content from '../components/Content';
import DashboardRow from '../components/DashboardRow';
import Spinner from '../components/Spinner';
import Fonts from '../utils/Fonts';
import { getParams } from '../utils/Helpers';

const COMMISSION = 0.15;

class Dashboard extends React.Component {
  state = {
    giftOptions: [],
    isLoading: false,
    influencer: {
      pathname: '',
      id: '',
    },
    orders: [],
  };

  componentDidMount() {
    this.setData();
  }

  getInfluencerID = () => {
    const { i } = getParams(this.props);
    return i;
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
    const giftOptions = await actions.fetchDocsGiftOptions(influencer.id);
    const orders = await actions.fetchDocsOrders(influencer.id);
    this.setState({ giftOptions, orders });
    this.setState({ isLoading: false });
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
    const { giftOptions, influencer, isLoading, orders } = this.state;
    // console.log('orders', orders);

    const totalRevenue = orders.reduce(
      (aggr, order) => aggr + (order.total - order.paypalFee) * (1 - COMMISSION),
      0
    );

    let giftsRecieved = null;

    if (orders) {
      giftsRecieved = _.chain(orders)
        .sort((a, b) => b.purchaseDate - a.purchaseDate)
        .map(order => ({ ...order, date: moment(order.purchaseDate).format('MMM Do') }))
        .groupBy('date')
        .map((group, date) => {
          const rows = group.map(order => {
            const giftOption = giftOptions.find(option => option.id === order.giftID);
            return (
              <DashboardRow
                key={order.id}
                name={giftOption.name}
                username={order.username}
                handleThankFan={this.handleThankFan(giftOption.snapLensURL, order.id)}
                handleUndo={this.handleUndo(order.id)}
                wasThanked={order.wasThanked}
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
    }

    if (isLoading) {
      return (
        <Content>
          <Fonts.H3 centered>Loading Dashboard</Fonts.H3>
          <Spinner />
        </Content>
      );
    }

    return (
      <Content>
        <Fonts.H1 centered noMarginBottom>
          {influencer.displayName}'s Dashboard
        </Fonts.H1>
        <Content.Row justifyCenter>
          <Fonts.H2 noMarginBottom centered>
            ${totalRevenue.toFixed(2)}
          </Fonts.H2>
          <Content.Gap />
          <Fonts.P>total gift income</Fonts.P>
        </Content.Row>
        <Content.Row justifyCenter>
          <Fonts.H2 noMarginBottom centered>
            {orders.length}
          </Fonts.H2>
          <Content.Gap />
          <Fonts.P>gifts received</Fonts.P>
        </Content.Row>
        <Content.Spacing16px />
        <Content.Seperator />
        <Fonts.H2>Gifts Recieved</Fonts.H2>
        {giftsRecieved}
      </Content>
    );
  }
}

export default Dashboard;
