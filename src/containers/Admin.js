import _ from 'lodash';
import React from 'react';

import actions from '../data/actions';
import Content from '../components/Content';
import { COMMISSION } from '../utils/Constants';
import Countdown from '../components/Countdown';
import Fonts from '../utils/Fonts';
import { getDateAddDays } from '../utils/Helpers';
import Spinner from '../components/Spinner';

class Admin extends React.Component {
  state = {
    influencers: [],
    isLoading: true,
    orders: [],
  };

  componentDidMount() {
    this.setData();
  }

  getRevenue = orders => orders.reduce((aggr, order) => aggr + order.total, 0);

  setData = async () => {
    const influencers = await actions.fetchDocsInfluencers();
    const ordersSeperated = await Promise.all(
      influencers.map(async influencer => actions.fetchDocsOrders(influencer.id))
    );
    const orders = _.flatten(ordersSeperated);
    this.setState({ influencers, orders, isLoading: false });
  };

  sortByDisplayName = (a, b) => {
    if (a.displayName < b.displayName) return -1;
    if (a.displayName > b.displayName) return 1;
    return 0;
  };

  render() {
    const { influencers, isLoading, orders } = this.state;

    const revenueTotal = this.getRevenue(orders);
    const revenueIlysm = revenueTotal * COMMISSION;
    const revenueInfluencers = revenueTotal * (1 - COMMISSION);

    const influencerStats = influencers.sort(this.sortByDisplayName).map(influencer => {
      const influencerOrders = orders.filter(order => order.influencerID === influencer.id);
      const influencerRevenue = this.getRevenue(influencerOrders);
      const dateUpdateNext = getDateAddDays(influencer.dateUpdateLast, 7);
      return (
        <div key={influencer.id}>
          <Fonts.H3 centered>{influencer.displayName}</Fonts.H3>
          <Content.Row justifyStart>
            <Countdown date={dateUpdateNext} small />
            <Fonts.P>until next update</Fonts.P>
          </Content.Row>
          <Fonts.P>
            <strong>$ {influencerRevenue.toFixed(2)}</strong> total revenue
          </Fonts.P>
          <Fonts.P>
            <strong>$ {(influencerRevenue * COMMISSION).toFixed(2)}</strong> ily.sm revenue
          </Fonts.P>
          <Fonts.P>
            <strong>$ {(influencerRevenue * (1 - COMMISSION)).toFixed(2)}</strong> influencer
            revenue
          </Fonts.P>
          <Fonts.P>
            <strong>{influencerOrders.length}</strong> gifts
          </Fonts.P>
          <Content.Spacing8px />
        </div>
      );
    });

    if (isLoading) return <Spinner />;

    return (
      <Content>
        <Fonts.H1>Admin Page</Fonts.H1>
        <Fonts.H3>Total</Fonts.H3>
        <Fonts.P>
          <strong>$ {revenueTotal.toFixed(2)}</strong> total revenue
        </Fonts.P>
        <Fonts.P>
          <strong>$ {revenueIlysm.toFixed(2)}</strong> ily.sm revenue
        </Fonts.P>
        <Fonts.P>
          <strong>$ {revenueInfluencers.toFixed(2)}</strong> influencer revenue
        </Fonts.P>
        <Content.Spacing8px />
        <Fonts.P>
          <strong>{orders.length}</strong> gifts sold
        </Fonts.P>
        <Fonts.P>
          <strong>{influencers.length}</strong> influencers live
        </Fonts.P>
        <Content.Seperator />
        {influencerStats}
      </Content>
    );
  }
}

export default Admin;
