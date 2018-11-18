import React from 'react';
import PropTypes from 'prop-types';

import Btn from '../Btn';
import Content from '../Content';
import Fonts from '../../utils/Fonts';
import Popup from '../Popup';

const propTypes = {
  coinName: PropTypes.string.isRequired,
  handleBuyPoints: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  influencerName: PropTypes.string.isRequired,
};

const defaultProps = {};

class PopupBuyPoints extends React.Component {
  state = {};

  render() {
    const { coinName, handleBuyPoints, handleClose, influencerName } = this.props;

    return (
      <div>
        <Popup.BackgroundLight />
        <Popup.CardTransparent>
          <Popup.BtnClose handleClose={handleClose} />
          <Content.Spacing />
          <Popup.Emoji>
            <span role="img" aria-label="money">
              💰
            </span>
          </Popup.Emoji>
          <Btn primary onClick={handleBuyPoints}>
            Buy {coinName}
          </Btn>
          <Content.Spacing />
          <Content.Seperator />
          <Fonts.H3 centered>Did you know?</Fonts.H3>
          <Fonts.P centered>
            You can also earn {coinName} by liking, commenting and tagging your friends in{' '}
            {influencerName}
            's posts.
          </Fonts.P>
        </Popup.CardTransparent>
      </div>
    );
  }
}

PopupBuyPoints.propTypes = propTypes;
PopupBuyPoints.defaultProps = defaultProps;

export default PopupBuyPoints;
