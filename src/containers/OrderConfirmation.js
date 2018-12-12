import React from 'react';
import { Link } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';

import Btn from '../components/Btn';
import Content from '../components/Content';
import Currency from '../components/Currency';
import GiftImg from '../components/GiftImg';
import Spinner from '../components/Spinner';
import actions from '../data/actions';
import { ITEM_TYPE } from '../utils/Constants';
import Fonts from '../utils/Fonts';
import { getParams } from '../utils/Helpers';

class OrderConfirmation extends React.Component {
  state = {
    gift: {
      imgURL: '',
      id: '',
      name: '',
      prefix: '',
      price: '-',
    },
    item: {},
    influencer: {
      displayName: '',
    },
    isLoading: true,
    order: {
      influencerID: '',
      itemID: '',
      orderNum: '-',
      message: '',
      type: '',
    },
  };

  componentDidMount() {
    this.setData();
    mixpanel.track('Visited Order Confirmation');
  }

  setData = async () => {
    const { orderID } = getParams(this.props);
    const order = await actions.fetchDocOrder(orderID);
    const influencer = await actions.fetchDocInfluencerByID(order.influencerID);
    if (order.type === ITEM_TYPE.gift) {
      const gift = await actions.fetchDocGift(order.giftID);
      this.setState({ gift });
    } else {
      const item = await actions.fetchDocItem(order.itemID);
      this.setState({ item });
    }
    this.setState({ influencer, order, isLoading: false });
  };

  render() {
    const { gift, influencer, item, isLoading, order } = this.state;

    if (isLoading) return <Spinner />;

    const title =
      order.type === ITEM_TYPE.gift
        ? `You sent ${influencer.displayName} ${gift.prefix} ${gift.name}!`
        : `Message sent to ${influencer.displayName}!`;

    const subtitle =
      order.type === ITEM_TYPE.gift
        ? `${gift.description}`
        : `We'll DM you on Instagram with a link to your reply from ${
            influencer.displayName
          } within one week.`;

    const imgSrc = order.type === ITEM_TYPE.gift ? gift.imgURL : item.imgURL;

    return (
      <Content>
        <Fonts.H1 centered>{title}</Fonts.H1>
        <Content.Row justifyCenter>
          <GiftImg src={imgSrc} />
        </Content.Row>
        <Fonts.H3 centered>{subtitle}</Fonts.H3>
        <Fonts.P centered>If you have any questions please contact us:</Fonts.P>
        <Content.Row justifyCenter>
          <Fonts.P centered>Message us on Instagram </Fonts.P> <Content.Gap />
          <Fonts.Link>@ilydotsm</Fonts.Link>
        </Content.Row>
        <Content.Row justifyCenter>
          <Fonts.P centered>Email us</Fonts.P>
          <Content.Gap /> <Fonts.Link>ilydotsm@gmail.com</Fonts.Link>
        </Content.Row>
        <Content.Row justifyCenter>
          <Fonts.P centered>Call us on</Fonts.P>
          <Content.Gap /> <Fonts.Link>+1 (213) 249-4523</Fonts.Link>
        </Content.Row>
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
