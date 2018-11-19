import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Btn from '../Btn';
// import Coins from './Coins';
import Content from '../Content';
import Fonts from '../../utils/Fonts';

const propTypes = {
  handleClick: PropTypes.func.isRequired,
  imgURL: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  merchID: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

const defaultProps = {};

const DashboardMerchRow = ({ handleClick, imgURL, price, merchID, name }) => {
  return (
    <div>
      <Content.Row>
        <MerchImg src={imgURL} />
        <Description>
          <Fonts.P>
            <strong>{name}</strong>
          </Fonts.P>
        </Description>
        <Btn primary narrow short onClick={handleClick} value={merchID}>
          Use Coins
        </Btn>
      </Content.Row>
      <Content.Spacing />
    </div>
  );
};

// NO PRICE INCLUDED - COPY BACK IN
// <Fonts.P>
// {' '}
// <Coins.Icon small /> {getFormattedNumber(price)}
// </Fonts.P>

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

const MerchImg = styled.div`
  height: 32px;
  width: 32px;
  background-image: url(${props => props.src});
  background-size: cover;
`;

DashboardMerchRow.propTypes = propTypes;
DashboardMerchRow.defaultProps = defaultProps;

export default DashboardMerchRow;
