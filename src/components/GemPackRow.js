import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Btn from './Btn';
import Content from './Content';
import Fonts from '../utils/Fonts';
import GiftImg from './GiftImg';

const propTypes = {
  handleClick: PropTypes.func.isRequired,
  imgURL: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  gemPackID: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

const defaultProps = {};

const GemPackRow = ({ handleClick, imgURL, price, gemPackID, name }) => {
  return (
    <div>
      <Content.Row alignCenter>
        <Title>
          <GiftImg src={imgURL} small />
          <Description>
            <Fonts.H3 noMargin>
              <strong>{name}</strong>
            </Fonts.H3>
          </Description>
        </Title>
        <Btn primary narrow short onClick={handleClick} value={gemPackID}>
          ${price.toFixed(2)}
        </Btn>
      </Content.Row>
      <Content.Spacing />
    </div>
  );
};

const Title = styled.div`
  display: flex;
  align-items: center;
`;

const Description = styled.div`
  flex-grow: 1;
  max-width: 156px;

  margin-left: 8px;
`;

GemPackRow.propTypes = propTypes;
GemPackRow.defaultProps = defaultProps;

export default GemPackRow;
