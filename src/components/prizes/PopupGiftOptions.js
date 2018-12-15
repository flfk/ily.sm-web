import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';

import Content from '../Content';
import Row from './Row';
import GiftImg from '../GiftImg';
import Popup from '../Popup';
import Fonts from '../../utils/Fonts';

const propTypes = {
  giftOptions: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleItemOrder: PropTypes.func.isRequired,
  influencer: PropTypes.object.isRequired,
};

const defaultProps = {};

class PopupGiftOptions extends React.Component {
  handleGiftSelect = async event => {
    const { handleClose, handleItemOrder, giftOptions } = this.props;
    const selectedItemID = event.target.value;
    const item = giftOptions.find(option => option.id === selectedItemID);
    handleItemOrder(item);
    handleClose();
  };

  render() {
    const { giftOptions, handleClose, influencer } = this.props;

    const giftsDiv = giftOptions
      .sort((a, b) => a.price - b.price)
      .map(item => (
        <Row
          key={item.id}
          imgURL={item.imgURL}
          handleClick={this.handleGiftSelect}
          name={item.name}
          price={item.price}
          value={item.id}
        />
      ));

    return (
      <div>
        <Popup.BackgroundLight />
        <Popup.CardTransparent>
          <Content.Spacing16px />
          <Popup.BtnClose handleClose={handleClose} />
          <Fonts.H1 centered>What gift do you want to send {influencer.displayName}? </Fonts.H1>
          {giftsDiv}
        </Popup.CardTransparent>
      </div>
    );
  }
}

PopupGiftOptions.propTypes = propTypes;
PopupGiftOptions.defaultProps = defaultProps;

export default PopupGiftOptions;
