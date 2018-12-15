import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Btn from '../Btn';
import Currency from '../Currency';
import Content from '../Content';
import Fonts from '../../utils/Fonts';
import ItemImg from './ItemImg';

const propTypes = {
  handleClick: PropTypes.func.isRequired,
  imgURL: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const defaultProps = {};

const Row = ({ handleClick, imgURL, price, name, value }) => {
  return (
    <div>
      <Content.Row alignCenter>
        <Title>
          <ItemImg src={imgURL} isSmall />
          <Description>
            <Fonts.P noMargin>
              <strong>{name}</strong>
            </Fonts.P>
            <Content.Row justifyStart>
              <Fonts.P>{price.toFixed(0)}</Fonts.P>
              <Content.Gap />
              <Currency.GemsSingle tiny />
            </Content.Row>
          </Description>
        </Title>
        <Btn primary narrow short onClick={handleClick} value={value}>
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

Row.propTypes = propTypes;
Row.defaultProps = defaultProps;

export default Row;
