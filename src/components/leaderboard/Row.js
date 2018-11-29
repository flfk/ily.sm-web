import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Content from '../Content';
import Currency from '../Currency';
import Colors from '../../utils/Colors';
import Fonts from '../../utils/Fonts';
import { getShortenedNumber } from '../../utils/Helpers';
import Wrapper from '../Wrapper';

const INSTAGRAM_URL_BASE = 'https://www.instagram.com/';

const propTypes = {
  inProgress: PropTypes.bool.isRequired,
  pointsComments: PropTypes.number,
  pointsPaid: PropTypes.number.isRequired,
  profilePicURL: PropTypes.string.isRequired,
  rank: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

const defaultProps = {
  pointsComments: 0,
};

const LeaderboardRow = ({
  inProgress,
  pointsComments,
  pointsPaid,
  profilePicURL,
  rank,
  type,
  username,
}) => {
  let medal = null;
  if (!inProgress) {
    switch (rank) {
      case 1:
        medal = '🥇';
        break;
      case 2:
        medal = '🥈';
        break;
      case 3:
        medal = '🥉';
        break;
      default:
        break;
    }
  }

  const rankFormatted = inProgress && pointsPaid === 0 ? '-' : rank;
  const pointsCommentsFormatted = inProgress ? '?' : getShortenedNumber(pointsComments);

  const gemScore =
    type === 'gems' && pointsPaid > 0 ? (
      <Score>
        <Text>
          <Currency.GemsSingle small /> {getShortenedNumber(pointsPaid)}
        </Text>
      </Score>
    ) : null;

  const coinScore =
    type === 'coins' ? (
      <Score>
        <Text>
          <Currency.CoinsSingle small /> {pointsCommentsFormatted}
        </Text>
      </Score>
    ) : null;

  return (
    <Container key={username} alignCenter>
      <ContentLHS href={INSTAGRAM_URL_BASE + username} target="_blank">
        <Wrapper.ProfileImage>
          <img src={profilePicURL} alt="" />
        </Wrapper.ProfileImage>{' '}
        <Rank>{rankFormatted}</Rank>
        <Text>{username}</Text>
        <span role="img" aria-label="trophy">
          {medal}
        </span>
      </ContentLHS>
      {gemScore}
      {coinScore}
    </Container>
  );
};

const Container = styled(Content.Row)`
  margin-top: 8px;
  margin-bottom: 8px;
  justify-content: space-between;
`;

const Text = styled(Fonts.H3)`
  font-size: 14px;
  margin: 0;
  max-width: 144px;

  overflow: hidden;
  text-overflow: ellipsis;
`;

const Rank = styled(Fonts.P)`
  margin-right: 16px;
  font-weight: bold;
  color: ${Colors.greys.supporting};
`;

const ContentLHS = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
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
