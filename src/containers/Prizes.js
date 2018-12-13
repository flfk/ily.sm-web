import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import actions from '../data/actions';
import Btn from '../components/Btn';
import Content from '../components/Content';
import Currency from '../components/Currency';
import Header from '../components/Header';
import { ITEM_TYPE } from '../utils/Constants';
import { getParams } from '../utils/Helpers';
import Fonts from '../utils/Fonts';
import { Footer, ItemRow } from '../components/prizes';
import Spinner from '../components/Spinner';

const propTypes = {
  username: PropTypes.string,
};

const defaultProps = {
  username: '',
};

const mapStateToProps = state => ({
  username: state.user.username,
});

const mapDispatchToProps = dispatch => ({});

class Prizes extends React.Component {
  state = {
    giftOptions: [],
    influencer: {
      dateUpdateLast: 0,
      displayName: '',
      fandom: '',
      id: '',
      mostRecentImgURL: '',
      username: '',
    },
    items: [],
    isLoading: true,
    selectedItemID: '',
    toStoreGems: false,
    toStoreGifts: false,
    toStoreMessage: false,
  };

  componentDidMount() {
    this.setData();
  }

  fetchInfluencer = async () => {
    const { i } = getParams(this.props);
    const influencer = await actions.fetchDocInfluencerByField('username', i);
    return influencer;
  };

  goToStoreGifts = () => {
    const { influencer } = this.state;
    return (
      <Redirect
        push
        to={{
          pathname: '/gifts',
          search: `?i=${influencer.id}`,
        }}
      />
    );
  };

  goToStoreMessage = () => {
    const { influencer, selectedItemID } = this.state;
    return (
      <Redirect
        push
        to={{
          pathname: '/message',
          search: `?i=${influencer.id}&itemID=${selectedItemID}`,
        }}
      />
    );
  };

  goToStoreGems = () => {
    const { influencer } = this.state;
    return (
      <Redirect
        push
        to={{
          pathname: '/gems',
          search: `?i=${influencer.id}`,
        }}
      />
    );
  };

  handleSelectStore = type => event => {
    if (type === ITEM_TYPE.message) {
      this.setState({ toStoreMessage: true, selectedItemID: event.target.value });
    }
    if (type === ITEM_TYPE.gift) {
      this.setState({ toStoreGifts: true });
    }
    if (type === ITEM_TYPE.gemPack) {
      this.setState({ toStoreGems: true });
    }
  };

  setData = async () => {
    const influencer = await this.fetchInfluencer();
    this.setState({ influencer });
    const giftOptions = await actions.fetchDocsGiftOptions(influencer.id);
    const giftOptionsActive = giftOptions.filter(option => option.isActive);
    const items = await actions.fetchDocsItems(influencer.id);
    const itemsActive = items.filter(item => item.isActive);
    this.setState({ giftOptions: giftOptionsActive, items: itemsActive, isLoading: false });
    mixpanel.track('Visited Leaderboard', { influencer: influencer.username });
  };

  render() {
    const {
      giftOptions,
      influencer,
      items,
      isLoading,
      toStoreGems,
      toStoreGifts,
      toStoreMessage,
    } = this.state;

    const { username } = this.props;

    if (toStoreGems) return this.goToStoreGems();
    if (toStoreGifts) return this.goToStoreGifts();
    if (toStoreMessage) return this.goToStoreMessage();

    if (isLoading) return <Spinner />;

    const wallet = username ? (
      <Content.Row alignTop>
        <div>
          <Fonts.P isSupporting>YOUR BALANCE</Fonts.P>
          <Fonts.H3 noMarginTop>
            13 <Currency.GemsSingle small />
          </Fonts.H3>
        </div>
        <Btn.Tertiary onClick={this.handleSelectStore(ITEM_TYPE.gemPack)}>
          Get More Gems
        </Btn.Tertiary>
      </Content.Row>
    ) : null;

    const messageRow = items
      .filter(item => item.type === ITEM_TYPE.message)
      .map(item => (
        <ItemRow
          key={item.id}
          imgURL={item.imgURL}
          handleClick={this.handleSelectStore(item.type)}
          name={item.name}
          price={item.price}
          value={item.id}
        />
      ));

    const cheapestGift = giftOptions.sort((a, b) => a.price - b.price)[0];
    const giftRow = (
      <ItemRow
        imgURL={cheapestGift.imgURL}
        handleClick={this.handleSelectStore(ITEM_TYPE.gift)}
        name={`Send ${influencer.displayName} a gift`}
        price={cheapestGift.price}
        value={cheapestGift.id}
      />
    );

    const footer = username ? null : (
      <div>
        <Content.Spacing />
        <Content.Spacing />
        <Content.Spacing />
        <Footer influencerName={influencer.displayName} redirectPathname="signup">
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
            selectedScreen="Prizes"
            username={influencer.username}
          />
          {wallet}
          {messageRow}
          {giftRow}
          <Content.Spacing />
        </Content>
        {footer}
      </div>
    );
  }
}

Prizes.propTypes = propTypes;
Prizes.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Prizes);
