import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Btn from './Btn';
import Currency from './Currency';
import Content from './Content';
import Fonts from '../utils/Fonts';
import GiftImg from './GiftImg';

const propTypes = {
  handleClick: PropTypes.func.isRequired,
  imgURL: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  giftID: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

const defaultProps = {};

const GiftRow = ({ handleClick, imgURL, price, giftID, name }) => {
  return (
    <div>
      <Content.Row alignCenter>
        <Title>
          <GiftImg src={imgURL} small />
          <Description>
            <Fonts.H3 noMargin>
              <strong>{name}</strong>
            </Fonts.H3>
            <Content.Row justifyStart>
              <Fonts.P>{price.toFixed(0)}</Fonts.P>
              <Content.Gap />
              <Currency.GemsSingle tiny />
            </Content.Row>
          </Description>
        </Title>
        <Btn primary narrow short onClick={handleClick} value={giftID}>
          Send Gift
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

GiftRow.propTypes = propTypes;
GiftRow.defaultProps = defaultProps;

export default GiftRow;
