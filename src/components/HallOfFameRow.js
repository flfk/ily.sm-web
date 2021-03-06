import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment-timezone';

import Content from './Content';
import Fonts from '../utils/Fonts';
import CommentCountRow from './CommentCountRow';
import Wrapper from './Wrapper';

const propTypes = {
  dateFinished: PropTypes.number,
  imgURL: PropTypes.string.isRequired,
  winners: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.number.isRequired,
      profilePicURL: PropTypes.string,
      rank: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const defaultProps = {
  dateFinished: null,
};

const HallOfFameRow = ({ dateFinished, imgURL, winners }) => {
  // Placeholder cell
  if (dateFinished === null) {
    const placeholderRows = [1, 2, 3].map(place => (
      <CommentCountRow
        key={place}
        count={0}
        isNarrow
        profilePicURL={''}
        rank={place}
        username={''}
      />
    ));

    return (
      <Container isPlaceholder>
        <Content.Row justifySpaceAround alignCenter>
          <Wrapper.Post>
            <img src={imgURL} alt="" />
          </Wrapper.Post>
          <Winners>{placeholderRows}</Winners>
        </Content.Row>
      </Container>
    );
  }

  const winnersRows = winners.map(fan => {
    return (
      <CommentCountRow
        key={fan.username}
        count={fan.count}
        isNarrow
        profilePicURL={fan.profilePicURL}
        rank={fan.rank}
        username={fan.username}
      />
    );
  });

  return (
    <Container>
      <Fonts.P>
        {moment(dateFinished)
          .format('Do MMM YYYY')
          .toUpperCase()}
      </Fonts.P>
      <Content.Spacing8px />
      <Content.Row justifySpaceAround alignCenter>
        <Wrapper.Post>
          <img src={imgURL} alt="" />
        </Wrapper.Post>
        <Winners>{winnersRows}</Winners>
      </Content.Row>
    </Container>
  );
};

const Container = styled.div`
  opacity: ${props => (props.isPlaceholder ? '0.4' : '1.0')};
  margin: 8px;
`;

const Winners = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
`;

HallOfFameRow.propTypes = propTypes;
HallOfFameRow.defaultProps = defaultProps;

export default HallOfFameRow;
