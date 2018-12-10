import mixpanel from 'mixpanel-browser';
import React from 'react';
import { Redirect } from 'react-router-dom';

import actions from '../data/actions';
import Btn from '../components/Btn';
import Content from '../components/Content';
import Currency from '../components/Currency';
import Header from '../components/Header';
import { getParams } from '../utils/Helpers';
import Fonts from '../utils/Fonts';
import { Footer, ItemRow } from '../components/prizes';
import Spinner from '../components/Spinner';

const ITEMS = [
  {
    id: 'abc123',
    influencerID: '3iZ4jV8gUfmEEdNSz6NE',
    imgURL:
      'https://firebasestorage.googleapis.com/v0/b/ilysm-15824.appspot.com/o/giftOptions%2FJonGift_macncheese.png?alt=media&token=ff3d4c30-83a4-43cb-ad3d-16cb4df32f52',
    name: 'Message from Freo',
    price: 45,
    isAvailable: true,
  },
  {
    id: 'xyz987',
    influencerID: '3iZ4jV8gUfmEEdNSz6NE',
    imgURL:
      'https://firebasestorage.googleapis.com/v0/b/ilysm-15824.appspot.com/o/giftOptions%2FJonGift_macncheese.png?alt=media&token=ff3d4c30-83a4-43cb-ad3d-16cb4df32f52',
    name: 'Send Freo a gift',
    price: 45,
    isAvailable: true,
  },
];

class Prizes extends React.Component {
  state = {
    influencer: {
      dateUpdateLast: 0,
      displayName: '',
      fandom: '',
      id: '',
      mostRecentImgURL: '',
      username: '',
    },
    items: ITEMS,
    isLoading: true,
  };

  componentDidMount() {
    this.setData();
  }

  fetchInfluencer = async () => {
    const { i } = getParams(this.props);
    const influencer = await actions.fetchDocInfluencerByField('username', i);
    return influencer;
  };

  handleSelectPrize = itemID => () => {
    console.log(itemID, 'selected');
  };

  setData = async () => {
    const influencer = await this.fetchInfluencer();
    this.setState({ influencer });
    mixpanel.track('Visited Leaderboard', { influencer: influencer.username });
    this.setState({ isLoading: false });
  };

  render() {
    const { influencer, items, isLoading } = this.state;

    if (isLoading) return <Spinner />;

    const wallet = (
      <Content.Row alignTop>
        <div>
          <Fonts.P isSupporting>YOUR BALANCE</Fonts.P>
          <Fonts.H3 noMarginTop>
            13 <Currency.GemsSingle small />
          </Fonts.H3>
        </div>
        <Btn.Tertiary>Get More Gems</Btn.Tertiary>
      </Content.Row>
    );

    const itemRows = items.map(item => (
      <ItemRow
        key={item.id}
        imgURL={item.imgURL}
        handleClick={this.handleSelectPrize(item.id)}
        itemID={item.id}
        name={item.name}
        price={item.price}
      />
    ));

    const footer = (
      <div>
        <Content.Spacing />
        <Content.Spacing />
        <Content.Spacing />
        <Footer influencerName={influencer.displayName} handleClaim={this.handleClaim}>
          Footer
        </Footer>
      </div>
    );

    return (
      <div>
        <Content>
          <Header
            fandom={influencer.fandom}
            profilePicURL={influencer.profilePicURL}
            selectedScreen={'Prizes'}
            username={influencer.username}
          />
          {wallet}
          {itemRows}
          <Content.Spacing />
        </Content>
        {footer}
      </div>
    );
  }
}

export default Prizes;
