import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Fonts from '../../utils/Fonts';
import LogoInsta from '../../assets/LogoInsta.png';

const propTypes = {
  influencerUsername: PropTypes.string.isRequired,
  influencerProfilePicURL: PropTypes.string,
};

const defaultProps = {
  influencerProfilePicURL:
    'https://firebasestorage.googleapis.com/v0/b/online-meet-and-greets.appspot.com/o/default_profile.png?alt=media&token=abd27f4c-31e9-499e-a3aa-a97f61a5e7ea',
};

const InfluencerProfile = ({ influencerUsername, influencerProfilePicURL }) => {
  return (
    <Container>
      <InstaLogo img={LogoInsta} />
      <ProfileImg img={influencerProfilePicURL} />
      <Fonts.H3 noMargin>
        @{influencerUsername}
        's posts
      </Fonts.H3>
    </Container>
  );
};

const Container = styled.div`
  align-self: center;
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  // border: 1px solid red;
`;

const InstaLogo = styled.div`
  height: 40px;
  width: 40px;
  background-image: url(${props => props.img});
  background-size: cover;
  margin-right: 8px;
`;

const ProfileImg = styled.div`
  height: 40px;
  width: 40px;
  background-image: url(${props => props.img});
  background-size: cover;
  border-radius: 50%;
  margin-right: 8px;
`;

InfluencerProfile.propTypes = propTypes;
InfluencerProfile.defaultProps = defaultProps;

export default InfluencerProfile;
