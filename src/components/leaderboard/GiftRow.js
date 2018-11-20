import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Btn from '../Btn';
import Currency from '../Currency';
import Content from '../Content';
import Fonts from '../../utils/Fonts';

const propTypes = {
  handleClick: PropTypes.func.isRequired,
  imgURL: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  giftID: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

const defaultProps = {};

const DashboardMerchRow = ({ handleClick, imgURL, price, giftID, name }) => {
  return (
    <div>
      <Content.Row alignCenter>
        <GiftImg src={imgURL} />
        <Description>
          <Fonts.H3 noMargin>
            <strong>{name}</strong>
          </Fonts.H3>
          <Fonts.P>${price.toFixed(2)}</Fonts.P>
        </Description>
        <BtnDiv>
          <Btn primary narrow short onClick={handleClick} value={giftID}>
            Send Gift
          </Btn>
          <Content.Row justifyCenter>
            <Fonts.P>
              earn <strong>15</strong>{' '}
            </Fonts.P>
            <Currency.GemsSingle small />
          </Content.Row>
        </BtnDiv>
      </Content.Row>
      <Content.Spacing />
    </div>
  );
};

const Description = styled.div`
  flex-grow: 1;
  max-width: 156px;

  // remove below if including price
  height: 32px;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
`;

const BtnDiv = styled.div`
  display: flex:
  flex-direction: column;
  justify-content: flex-end;

  > button {
    margin-bottom: 4px;
  }
`;

const GiftImg = styled.div`
  height: 32px;
  width: 32px;
  background-image: url(${props => props.src});
  background-size: cover;
`;

DashboardMerchRow.propTypes = propTypes;
DashboardMerchRow.defaultProps = defaultProps;

export default DashboardMerchRow;
