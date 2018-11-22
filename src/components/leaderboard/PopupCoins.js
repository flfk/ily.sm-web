import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaComment, FaTachometerAlt, FaUserTag } from 'react-icons/fa';
import moment from 'moment-timezone';
import mixpanel from 'mixpanel-browser';

import Currency from '../Currency';
import Content from '../Content';
import Countdown from '../Countdown';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';
import { getDateAddDays } from '../../utils/Helpers';
import Popup from '../Popup';

const propTypes = {
  dateUpdateNext: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};

const defaultProps = {};

class PopupCoins extends React.Component {
  componentDidMount() {
    const { username } = this.props;
    mixpanel.track('Visited Coin Popup', { influencer: username });
  }

  getNextUpdate = () => {};

  render() {
    const { dateUpdateNext, handleClose, username } = this.props;

    const dateUpdateLast = getDateAddDays(dateUpdateNext, -7);

    const sinceTxt = moment(dateUpdateLast).format('DD MMM');

    return (
      <div>
        <Popup.BackgroundLight />
        <Popup.CardTransparent>
          <Popup.BtnClose handleClose={handleClose} />
          <Content.Centered>
            <Currency.CoinsMany large />
          </Content.Centered>

          <Fonts.H1 centered>Earn Comment Coins</Fonts.H1>
          <Fonts.P centered noMargin>
            by commenting on{' '}
            <Fonts.A href={`https://www.instagram.com/${username}`}>@{username}</Fonts.A>'s recent
            Instagram posts <strong>since {sinceTxt}</strong>
          </Fonts.P>
          <br />
          <Row>
            <FaTachometerAlt /> <Fonts.P> Early comments</Fonts.P>
          </Row>
          <Row>
            <FaComment /> <Fonts.P> Amount of comments</Fonts.P>
          </Row>
          <Row>
            <FaUserTag /> <Fonts.P> Tagging friends</Fonts.P>
          </Row>
          <Content.Spacing />
          <Fonts.P centered>Time left until this week's Comment Coins awarded</Fonts.P>
          <Countdown date={dateUpdateNext} />
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
    font-size: 24px;
    margin-right: 8px;
  }

  color: ${Colors.primary.red};
`;

PopupCoins.propTypes = propTypes;
PopupCoins.defaultProps = defaultProps;

export default PopupCoins;
