import React from 'react';
import { Link } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';

import Btn from '../components/Btn';
import Content from '../components/Content';
import GiftImg from '../components/GiftImg';
import Spinner from '../components/Spinner';
import actions from '../data/actions';
import { ITEM_TYPE } from '../utils/Constants';
import Fonts from '../utils/Fonts';
import { getParams } from '../utils/Helpers';

class OrderConfirmation extends React.Component {
  state = {
    gemPack: {},
    // gift: {},
    item: {},
    influencer: {
      displayName: '',
    },
    isLoading: true,
    order: {},
  };

  componentDidMount() {
    this.setData();
    mixpanel.track('Visited Order Confirmation');
  }

  setData = async () => {
    const { orderID } = getParams(this.props);
    const order = await actions.fetchDocOrder(orderID);
    let influencer = {};
    if (order.type === ITEM_TYPE.gemPack) {
      const { i } = getParams(this.props);
      influencer = await actions.fetchDocInfluencerByID(i);
      const gemPack = await actions.fetchDocGemPack(order.gemPackID);
      this.setState({ gemPack });
    } else {
      influencer = await actions.fetchDocInfluencerByID(order.influencerID);
      const item = await actions.fetchDocItem(order.itemID);
      this.setState({ item });
    }
    this.setState({ influencer, order, isLoading: false });
  };

  render() {
    const { gemPack, influencer, item, isLoading, order } = this.state;

    if (isLoading) return <Spinner />;

    let title = null;
    if (order.type === ITEM_TYPE.gift)
      title = `You sent ${influencer.displayName} ${item.prefix} ${item.name}!`;
    if (order.type === ITEM_TYPE.message) title = `Message sent to ${influencer.displayName}!`;
    if (order.type === ITEM_TYPE.gemPack) title = `You got ${gemPack.gems} gems.`;

    let subtitle = null;
    if (order.type === ITEM_TYPE.gift) subtitle = item.description;
    if (order.type === ITEM_TYPE.message)
      subtitle = `We'll DM you on Instagram with a link to your reply from ${
        influencer.displayName
      } within one week.`;
    if (order.type === ITEM_TYPE.gemPack) subtitle = `Spend your gems on any prize.`;

    let imgSrc = null;
    if (order.type === ITEM_TYPE.gift) imgSrc = item.imgURL;
    if (order.type === ITEM_TYPE.message) imgSrc = item.imgURL;
    if (order.type === ITEM_TYPE.gemPack) imgSrc = gemPack.imgURL;

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
          <Fonts.Link href="https://www.instagram.com/ilydotsm/" target="_blank">
            @ilydotsm
          </Fonts.Link>
        </Content.Row>
        <Content.Row justifyCenter>
          <Fonts.P centered>Email us</Fonts.P>
          <Content.Gap />
          <Fonts.Link href="mailto:ilydotsm@gmail.com" target="_blank">
            ilydotsm@gmail.com
          </Fonts.Link>
        </Content.Row>
        <Content.Row justifyCenter>
          <Fonts.P centered>Call us on</Fonts.P>
          <Content.Gap />
          <Fonts.Link href="tel:+1 (213) 249-4523" target="_blank">
            +1 (213) 249-4523
          </Fonts.Link>
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
