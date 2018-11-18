import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import TrophyEmojis from './TrophyEmojis';

const propTypes = {
  // levelEmoji: PropTypes.string.isRequired,
  trophies: PropTypes.arrayOf(PropTypes.string).isRequired,
  profilePicURL: PropTypes.string.isRequired,
};

const defaultProps = {};

const DEFAULT_PROFILE_PIC_URL =
  'https://firebasestorage.googleapis.com/v0/b/online-meet-and-greets.appspot.com/o/default_profile.png?alt=media&token=abd27f4c-31e9-499e-a3aa-a97f61a5e7ea';

const DashboardProfile = ({ trophies, profilePicURL }) => {
  const hasTrophyComments = trophies.indexOf('comments') > -1;
  const hasTrophySpeed = trophies.indexOf('speed') > -1;
  const hasTrophyTags = trophies.indexOf('tags') > -1;
  const hasTrophyRank = trophies.indexOf('rank') > -1;

  return (
    <Container img={profilePicURL || DEFAULT_PROFILE_PIC_URL}>
      <TrophyContainer>
        <TrophyEmojis.Speed hasTrophy={hasTrophySpeed} isSmall />
        <TrophyEmojis.Comments hasTrophy={hasTrophyComments} isSmall />
        <TrophyEmojis.Tags hasTrophy={hasTrophyTags} isSmall />
        <TrophyEmojis.Rank hasTrophy={hasTrophyRank} isSmall />
      </TrophyContainer>
    </Container>
  );
};

const Container = styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  // border: 1px solid red;

  height: 96px;
  width: 96px;
  background-image: url(${props => props.img});
  background-size: cover;
  border-radius: 50%;
`;

// const ProfileImg = styled.div`
//   height: 80px;
//   width: 80px;
//   background-image: url(${props => props.profilePicURL});
//   background-size: cover;
//   border-radius: 50%;
// `;

const TrophyContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 20px;

  background-image: linear-gradient(#ffffff00, #ffffff30);
`;

DashboardProfile.propTypes = propTypes;
DashboardProfile.defaultProps = defaultProps;

export default DashboardProfile;
