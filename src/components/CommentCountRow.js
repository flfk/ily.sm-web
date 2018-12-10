import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Content from './Content';
import Colors from '../utils/Colors';
import Fonts from '../utils/Fonts';
import { getFormattedNumber } from '../utils/Helpers';
import Wrapper from './Wrapper';

const INSTAGRAM_URL_BASE = 'https://www.instagram.com/';

const DEFAULT_PROFILE_PIC_URL =
  'https://scontent-lga3-1.cdninstagram.com/vp/dc651f3c631c68d6e0789e2d7c8af2e5/5C8EBFF1/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg';

const propTypes = {
  count: PropTypes.number.isRequired,
  profilePicURL: PropTypes.string.isRequired,
  rank: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
};

const defaultProps = {};

const LeaderboardRow = ({ count, profilePicURL, rank, username }) => {
  const commentLabel = count > 1 ? 'comments' : 'comment';

  return (
    <Container key={username} alignCenter>
      <UserLink href={INSTAGRAM_URL_BASE + username} target="_blank">
        <Rank>{rank}</Rank>
        <Wrapper.ProfilePic>
          <img src={profilePicURL || DEFAULT_PROFILE_PIC_URL} alt="" />
        </Wrapper.ProfilePic>
        <Stats>
          <Text>{username}</Text>
          <Fonts.P isSecondary>
            {getFormattedNumber(count)} {commentLabel}
          </Fonts.P>
        </Stats>
      </UserLink>
    </Container>
  );
};

const Container = styled(Content.Row)`
  margin-top: 8px;
  margin-bottom: 8px;
  justify-content: center;
`;

const Text = styled(Fonts.H3)`
  font-size: 14px;
  margin: 0;
  width: 144px;

  overflow: hidden;
  text-overflow: ellipsis;
`;

const Rank = styled(Fonts.P)`
  margin-right: 16px;
  font-weight: bold;
  color: ${Colors.greys.supporting};
`;

const UserLink = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const Stats = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
`;

const Score = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-basis: 64px;
  font-size: 14px;
`;

LeaderboardRow.propTypes = propTypes;
LeaderboardRow.defaultProps = defaultProps;

export default LeaderboardRow;
