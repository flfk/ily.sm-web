import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaComment, FaTachometerAlt, FaUserTag } from 'react-icons/fa';
import mixpanel from 'mixpanel-browser';

import Currency from '../Currency';
import Content from '../Content';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';
import Popup from '../Popup';

const propTypes = {
  handleClose: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};

const defaultProps = {};

class PopupCoins extends React.Component {
  componentDidMount() {
    const { username } = this.props;
    mixpanel.track('Visited Coin Popup', { influencer: username });
  }

  render() {
    const { handleClose, username } = this.props;

    return (
      <div>
        <Popup.BackgroundLight />
        <Popup.CardTransparent>
          <Popup.BtnClose handleClose={handleClose} />
          <Content.Centered>
            <Currency.CoinsMany large />
          </Content.Centered>

          <Fonts.H1 centered>Get Comment Coins</Fonts.H1>
          <Fonts.H3 centered noMarginTop>
            by commenting on @jon_klaasen's Instagram Posts since 6pm Pacific Time, Wednesday, 15
            Nov
          </Fonts.H3>
          <br />
          <Row>
            <FaTachometerAlt /> <Fonts.H3> Early comments</Fonts.H3>
          </Row>
          <Row>
            <FaComment /> <Fonts.H3> Amount of comments</Fonts.H3>
          </Row>
          <Row>
            <FaUserTag /> <Fonts.H3> Tagging Friends</Fonts.H3>
          </Row>
          <Fonts.H3 centered>
            Next comment coin update on 6pm Pacific Time, Wednesday, 22 Nov
          </Fonts.H3>
        </Popup.CardTransparent>
      </div>
    );
  }
}

const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;

  > svg {
    font-size: 32px;
    margin-right: 8px;
  }

  color: ${Colors.primary.red};
`;

PopupCoins.propTypes = propTypes;
PopupCoins.defaultProps = defaultProps;

export default PopupCoins;
