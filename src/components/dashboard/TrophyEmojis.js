import PropTypes from 'prop-types';
import React from 'react';
import { FaLock } from 'react-icons/fa';
import styled from 'styled-components';

const propTypes = {
  hasTrophy: PropTypes.bool.isRequired,
  isSmall: PropTypes.bool,
};

const defaultProps = {
  isSmall: false,
};

const Emoji = styled.span`
  font-size: ${props => (props.isSmall ? '20px' : '48px')};
  filter: ${props => (props.hasTrophy ? '' : 'grayscale(100%)')};
  opacity: ${props => (props.hasTrophy ? '1' : '0.4')};
  display: ${props => (props.isSmall && !props.hasTrophy ? 'none' : '')};

  max-width: 50px;
`;

const Lock = styled.span`
  position: absolute;
  bottom: 0;
  right: 0;

  font-size: 16px;
  color: black;
  display: ${props => (props.hasTrophy ? 'none' : '')};
`;

const Comments = ({ hasTrophy, isSmall }) => (
  <Emoji hasTrophy={hasTrophy} isSmall={isSmall}>
    <span role="img" aria-label="trophy">
      🦁
    </span>
    <Lock hasTrophy={hasTrophy}>
      <FaLock />
    </Lock>
  </Emoji>
);

Comments.propTypes = propTypes;
Comments.defaultProps = defaultProps;

const Speed = ({ hasTrophy, isSmall }) => (
  <Emoji hasTrophy={hasTrophy} isSmall={isSmall}>
    <span role="img" aria-label="trophy">
      🍓
    </span>
    <Lock hasTrophy={hasTrophy}>
      <FaLock />
    </Lock>
  </Emoji>
);

Speed.propTypes = propTypes;
Speed.defaultProps = defaultProps;

const Tags = ({ hasTrophy, isSmall }) => (
  <Emoji hasTrophy={hasTrophy} isSmall={isSmall}>
    <span role="img" aria-label="trophy">
      🔮
    </span>
    <Lock hasTrophy={hasTrophy}>
      <FaLock />
    </Lock>
  </Emoji>
);

Tags.propTypes = propTypes;
Tags.defaultProps = defaultProps;

const Rank = ({ hasTrophy, isSmall }) => (
  <Emoji hasTrophy={hasTrophy} isSmall={isSmall}>
    <span role="img" aria-label="trophy">
      💎
    </span>
    <Lock hasTrophy={hasTrophy}>
      <FaLock />
    </Lock>
  </Emoji>
);

Rank.propTypes = propTypes;
Rank.defaultProps = defaultProps;

const Trophies = {};
Trophies.Speed = Speed;
Trophies.Comments = Comments;
Trophies.Tags = Tags;
Trophies.Rank = Rank;

export default Trophies;
