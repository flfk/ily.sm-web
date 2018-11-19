import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaComment, FaTachometerAlt, FaUserTag } from 'react-icons/fa';

import Currency from '../Currency';
import Content from '../Content';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';
import GiftRow from './GiftRow';
import Popup from '../Popup';

const propTypes = {
  handleClose: PropTypes.func.isRequired,
};

const defaultProps = {};

class PopupCoins extends React.Component {
  state = {};

  render() {
    const { handleClose, influencer } = this.props;

    const giftsDiv = GIFTS.sort((a, b) => a.price - b.price).map(item => (
      <GiftRow
        key={item.name}
        // TODO
        handleClick={() => true}
        price={item.price}
        giftID={item.giftID}
        name={item.name}
      />
    ));

    return (
      <div>
        <Popup.BackgroundLight />
        <Popup.CardTransparent>
          <Popup.BtnClose handleClose={handleClose} />
          <Content.Centered>
            <Currency.CoinsMany large />
          </Content.Centered>
          <Content.Spacing />
          {giftsDiv}
        </Popup.CardTransparent>
      </div>
    );
  }
}

const GIFTS = [
  {
    gemsEarned: 10,
    giftID: 'xyz',
    name: 'Chocolate bar',
    price: 1.99,
  },
  {
    gemsEarned: 100,
    giftID: 'xydfz',
    name: 'Concert tickets',
    price: 19.99,
  },
];

PopupCoins.propTypes = propTypes;
PopupCoins.defaultProps = defaultProps;

export default PopupCoins;
