import React from 'react';
import { Link } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';

import actions from '../data/actions';
import Btn from '../components/Btn';
import Content from '../components/Content';
import Currency from '../components/Currency';
import Fonts from '../utils/Fonts';
import { getDateAddDays, getParams } from '../utils/Helpers';
import GiftImg from '../components/GiftImg';
import Spinner from '../components/Spinner';

class OrderConfirmation extends React.Component {
  state = {
    influencer: {
      dateUpdateLast: 0,
      displayName: '',
      fandom: '',
      pathname: '',
    },
    gift: {
      gemsEarned: '-',
      imgURL: '',
      influencerID: '',
      id: '',
      isCustom: false,
      name: '',
      prefix: '',
      price: '-',
    },
    isLoading: true,
    order: {
      orderNum: '-',
      giftID: '',
    },
  };

  componentDidMount() {
    this.setData();
    mixpanel.track('Visited Order Confirmation');
  }

  getOrderID = () => {
    const { id } = getParams(this.props);
    return id;
  };

  setData = async () => {
    const orderID = this.getOrderID();
    const order = await actions.fetchDocOrder(orderID);
    const gift = await actions.fetchDocGift(order.giftID);
    const influencer = await actions.fetchDocInfluencerByID(gift.influencerID);
    this.setState({ gift, influencer, order, isLoading: false });
  };

  render() {
    const { gift, influencer, isLoading, order, toPrizes } = this.state;

    if (toPrizes) return this.goToLeaderboard();

    if (isLoading) return <Spinner />;

    return (
      <Content>
        <Fonts.H1 centered>Thanks for your gift!</Fonts.H1>
        <Fonts.H3 centered>
          You sent {influencer.displayName} {gift.prefix} {gift.name}
        </Fonts.H3>
        <Content.Row justifyCenter>
          <GiftImg src={gift.imgURL} />
        </Content.Row>
        <Fonts.H3 centered noMarginBottom>
          <strong>{order.username}</strong> received <Currency.GemsSingle small /> {gift.gemsEarned}
        </Fonts.H3>
        <Content.Spacing />
        <Link to={`/prizes?i=${influencer.username}`}>
          <Btn primary short fill="true">
            Back to Prizes
          </Btn>
        </Link>
      </Content>
    );
  }
}

export default OrderConfirmation;
