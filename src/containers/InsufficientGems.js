import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import Content from '../components/Content';
import GemPackRow from '../components/GemPackRow';
import GiftImg from '../components/GiftImg';
import Spinner from '../components/Spinner';
import Popup from '../components/Popup';
import actions from '../data/actions';
import { GEMS_PER_COMMENT } from '../utils/Constants';
import Fonts from '../utils/Fonts';
import { getFormattedNumber, getParams } from '../utils/Helpers';

const propTypes = {
  gemBalance: PropTypes.number,
};

const defaultProps = {
  gemBalance: 0,
};

const mapStateToProps = state => ({
  gemBalance: state.user.gemBalance,
});

const mapDispatchToProps = dispatch => ({});

class InsufficientGems extends React.Component {
  state = {
    gemPacks: [],
    item: {},
    isLoading: true,
    selectedGemPackID: '',
    toCheckout: false,
  };

  componentDidMount() {
    this.setData();
  }

  goToCheckout = () => {
    const { influencer, selectedGemPackID } = this.state;
    return (
      <Redirect
        push
        to={{
          pathname: '/checkout',
          search: `?gemPackID=${selectedGemPackID}&i=${influencer.id}`,
        }}
      />
    );
  };

  handleSelectGemPack = event => {
    const gemPackSelectedID = event.target.value;
    this.setState({ selectedGemPackID: gemPackSelectedID, toCheckout: true });
  };

  setData = async () => {
    const { i, itemID, giftID } = getParams(this.props);
    const gemPacks = await actions.fetchDocsGemPacks();
    const gemPacksActive = gemPacks.filter(pack => pack.isActive);
    const influencer = await actions.fetchDocInfluencerByID(i);
    const item = giftID ? await actions.fetchDocGift(giftID) : await actions.fetchDocItem(itemID);
    this.setState({ gemPacks: gemPacksActive, influencer, item, isLoading: false });
    mixpanel.track('Visited Insufficient Gems Page', {
      influencer: influencer.username,
      item: item.name,
    });
  };

  render() {
    const { gemPacks, isLoading, item, influencer, selectedGemPackID, toCheckout } = this.state;
    const { gemBalance } = this.props;

    if (isLoading) return <Spinner />;

    if (toCheckout && selectedGemPackID) return this.goToCheckout();

    const gemsRequired = item.price - gemBalance;
    const commentsRequired = (gemsRequired / GEMS_PER_COMMENT).toFixed(0);

    const gemPackLargest = gemPacks.sort((a, b) => b.gems - a.gems)[0];

    const gemPackSuggested =
      gemPacks.sort((a, b) => a.gems - b.gems).find(pack => pack.gems > gemsRequired) ||
      gemPackLargest;

    const gemPack = (
      <GemPackRow
        key={gemPackSuggested.id}
        gemPackID={gemPackSuggested.id}
        handleClick={this.handleSelectGemPack}
        imgURL={gemPackSuggested.imgURL}
        name={`${gemPackSuggested.gems} gems`}
        price={gemPackSuggested.price}
      />
    );

    return (
      <Content>
        <Content.Spacing16px />
        <Link to={`/prizes?i=${influencer.username}`}>
          <Popup.BtnClose handleClose={this.handleClose} />
        </Link>
        <Fonts.H1 centered>You need more gems to get a {item.name}.</Fonts.H1>
        <Content.Centered>
          <GiftImg src={item.imgURL} large />
        </Content.Centered>
        <Content.Seperator />
        <Fonts.H3 centered>Earn free gems</Fonts.H3>
        <Fonts.P centered>
          Comment <strong>{getFormattedNumber(commentsRequired)} more times</strong> on{' '}
          {influencer.displayName}'s most recent post to earn enough free gems
        </Fonts.P>
        <Content.Seperator />
        <Fonts.H3 centered>Buy more gems</Fonts.H3>
        {gemPack}
        <Content.Spacing />
      </Content>
    );
  }
}

InsufficientGems.propTypes = propTypes;
InsufficientGems.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InsufficientGems);
