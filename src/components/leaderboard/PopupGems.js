import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import actions from '../../data/actions';
import Currency from '../Currency';
import Content from '../Content';
import Fonts from '../../utils/Fonts';
import GiftRow from './GiftRow';
import Popup from '../Popup';

const propTypes = {
  handleClose: PropTypes.func.isRequired,
  influencerID: PropTypes.string.isRequired,
};

const defaultProps = {};

class PopupCoins extends React.Component {
  state = {
    giftOptions: [],
    toCheckout: false,
    selectedGiftID: '',
  };

  componentDidMount() {
    this.setGiftOptions();
  }

  setGiftOptions = async () => {
    const { influencerID } = this.props;
    const giftOptions = await actions.fetchDocsGiftOptions(influencerID);
    this.setState({ giftOptions });
  };

  handleGiftCheckout = event => {
    const giftID = event.target.value;
    this.setState({ selectedGiftID: giftID, toCheckout: true });
  };

  goToCheckout = () => {
    const { selectedGiftID } = this.state;
    return (
      <Redirect
        push
        to={{
          pathname: '/checkout',
          search: `?gift=${selectedGiftID}`,
        }}
      />
    );
  };

  render() {
    const { giftOptions, toCheckout, selectedGiftID } = this.state;
    const { handleClose, influencer } = this.props;

    if (toCheckout && selectedGiftID) return this.goToCheckout();

    const giftsDiv = giftOptions
      .sort((a, b) => a.price - b.price)
      .map(option => (
        <GiftRow
          key={option.id}
          handleClick={this.handleGiftCheckout}
          imgURL={option.imgURL}
          price={option.price}
          giftID={option.id}
          name={option.name}
        />
      ));

    return (
      <div>
        <Popup.BackgroundLight />
        <Popup.CardTransparent>
          <Popup.BtnClose handleClose={handleClose} />
          <Content.Centered>
            <Currency.GemsMany large />
          </Content.Centered>
          <Content.Spacing />
          {giftsDiv}
        </Popup.CardTransparent>
      </div>
    );
  }
}

PopupCoins.propTypes = propTypes;
PopupCoins.defaultProps = defaultProps;

export default PopupCoins;
