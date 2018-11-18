import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Content from '../Content';
import Fonts from '../../utils/Fonts';
import TrophyEmojis from './TrophyEmojis';

const propTypes = {
  trophies: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const defaultProps = {};

const Trophies = ({ trophies }) => {
  const hasTrophyComments = trophies.indexOf('comments') > -1;
  const hasTrophySpeed = trophies.indexOf('speed') > -1;
  const hasTrophyTags = trophies.indexOf('tags') > -1;
  const hasTrophyRank = trophies.indexOf('rank') > -1;

  return (
    <Content.Row alignTop>
      <TrophyContainer>
        <TrophyEmojis.Speed hasTrophy={hasTrophySpeed} />
        <TrophyText hasTrophy={hasTrophySpeed} centered>
          In First 10 Comments
        </TrophyText>
      </TrophyContainer>

      <TrophyContainer>
        <TrophyEmojis.Comments hasTrophy={hasTrophyComments} />
        <TrophyText hasTrophy={hasTrophyComments} centered>
          100 Comments
        </TrophyText>
      </TrophyContainer>

      <TrophyContainer>
        <TrophyEmojis.Tags hasTrophy={hasTrophyTags} />
        <TrophyText hasTrophy={hasTrophyTags} centered>
          10 Friends Tagged
        </TrophyText>
      </TrophyContainer>

      <TrophyContainer>
        <TrophyEmojis.Rank hasTrophy={hasTrophyRank} />
        <TrophyText hasTrophy={hasTrophyRank} centered>
          Top 100
        </TrophyText>
      </TrophyContainer>
    </Content.Row>
  );
};

const TrophyText = styled(Fonts.P)`
  opacity: ${props => (props.hasTrophy ? '1' : '0.6')};
`;

const TrophyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 90px;
`;

Trophies.propTypes = propTypes;
Trophies.defaultProps = defaultProps;

export default Trophies;
