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

const ItemRow = ({ handleClick, imgURL, price, name, value }) => {
  return (
    <Container>
      <ItemImg src={imgURL} />
      <Content.Spacing8px />
      <Fonts.H3 noMargin>{name}</Fonts.H3>
      <Content.Spacing8px />
      <Content.Row justifyCenter>
        <Fonts.H3 noMargin>{price.toFixed(0)}</Fonts.H3>
        <Content.Gap />
        <Currency.GemsSingle small />
      </Content.Row>
      <Content.Spacing8px />
      <Btn primary short onClick={handleClick} fill="true" value={value}>
        Get This
      </Btn>
      <Content.Spacing />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 32px;
  margin-right: 32px;
`;

ItemRow.propTypes = propTypes;
ItemRow.defaultProps = defaultProps;

export default ItemRow;
