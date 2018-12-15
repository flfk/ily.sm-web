import mixpanel from 'mixpanel-browser';
import PropTypes from 'prop-types';
import React from 'react';

import Btn from '../Btn';
import Content from '../Content';
import GiftImg from '../GiftImg';
import Popup from '../Popup';
import Fonts from '../../utils/Fonts';
import { getDate, getTimeRange } from '../../utils/Helpers';

const propTypes = {
  item: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleItemOrder: PropTypes.func.isRequired,
  influencer: PropTypes.object.isRequired,
};

const defaultProps = {};

class PopupVideoCall extends React.Component {
  state = {};

  handleChangeInput = field => event => this.setState({ [field]: event.target.value });

  handleConfirm = async () => {
    const { handleClose, handleItemOrder, item } = this.props;
    handleItemOrder(item);
    handleClose();
  };

  render() {
    const { handleClose, influencer, item } = this.props;

    return (
      <div>
        <Popup.BackgroundLight />
        <Popup.CardTransparent>
          <Content.Spacing16px />
          <Popup.BtnClose handleClose={handleClose} />
          <Fonts.H1 centered>
            {item.lengthMins} minute one-on-one video call with {influencer.displayName}
          </Fonts.H1>
          <Content.Centered>
            <GiftImg src={item.imgURL} />
          </Content.Centered>
          <Content.Spacing16px />
          <Fonts.P centered>
            The call will take place{' '}
            <strong>
              {getDate(item.dateStart)} between {getTimeRange(item.dateStart, item.dateEnd)}
            </strong>
            .
          </Fonts.P>
          <Content.Spacing8px />
          <Fonts.P centered>
            If you have any questions send us a DM on Instagram{' '}
            <Fonts.Link href="https://www.instagram.com/ilydotsm/" target="_blank">
              @ilydotsm
            </Fonts.Link>
            .
          </Fonts.P>
          <Content.Spacing />
          <Btn primary short onClick={this.handleConfirm}>
            Confirm
          </Btn>
        </Popup.CardTransparent>
      </div>
    );
  }
}

PopupVideoCall.propTypes = propTypes;
PopupVideoCall.defaultProps = defaultProps;

export default PopupVideoCall;
