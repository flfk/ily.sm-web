import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Coins from '../Coins';
import Fonts from '../../utils/Fonts';
import InfluencerProfile from './InfluencerProfile';
import Popup from '../Popup';

const propTypes = {
  handleClose: PropTypes.func.isRequired,
};

const defaultProps = {};

class PopupComingSoon extends React.Component {
  state = {};

  render() {
    const { handleClose, influencer } = this.props;

    return (
      <div>
        <Popup.BackgroundLight />
        <Popup.CardTransparent>
          <Popup.BtnClose handleClose={handleClose} />
          <Fonts.H3 centered>This feature will be available really soon!</Fonts.H3>
          <Popup.Emoji>
            <span role="img" aria-label="lock">
              🔒
            </span>
          </Popup.Emoji>
          <Fonts.H1 centered>Earn free coins on</Fonts.H1>
          <InfluencerProfile
            influencerUsername={influencer.username}
            influencerProfilePicURL={influencer.profilePicURL}
          />
          <br />
          <Row>
            <Coins.Few /> <Fonts.P> Comment on a post (faster is better)</Fonts.P>
          </Row>
          <Row>
            <Coins.Some /> <Fonts.P> Tag a friend in a post</Fonts.P>
          </Row>
          <Row>
            <Coins.Many /> <Fonts.P> Unlock trophies</Fonts.P>
          </Row>
        </Popup.CardTransparent>
      </div>
    );
  }
}

const Row = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 8px;
`;

PopupComingSoon.propTypes = propTypes;
PopupComingSoon.defaultProps = defaultProps;

export default PopupComingSoon;
