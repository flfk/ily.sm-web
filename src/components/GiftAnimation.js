import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Content from './Content';
import Gift from '../assets/Gift.png';
import GiftOpen from '../assets/GiftOpen.gif';

const propTypes = {
  imgURL: PropTypes.string.isRequired,
  isBeingOpened: PropTypes.bool.isRequired,
  wasOpened: PropTypes.bool.isRequired,
};

const defaultProps = {};

const GiftAnimation = ({ imgURL, isBeingOpened, wasOpened }) => {
  const giftImg = (
    <WrapperGiftImg>
      <img src={imgURL} alt="" />
    </WrapperGiftImg>
  );

  const giftAnimation = (
    <WrapperAnimation>
      <img src={GiftOpen} alt="" />
    </WrapperAnimation>
  );

  const giftStatic = (
    <WrapperStatic>
      <Content.Spacing16px />
      <Content.Spacing8px />
      <img src={Gift} alt="" />
    </WrapperStatic>
  );

  let gift = null;

  if (!wasOpened) gift = giftStatic;
  if (wasOpened) gift = giftImg;
  if (isBeingOpened) gift = giftAnimation;

  return <Content.Row justifyCenter>{gift}</Content.Row>;
};

const WrapperAnimation = styled.div`
  height: 180px;
  width: 180px;

  img {
    height: 100%;
    width: 100%;
  }
`;

const WrapperGiftImg = styled(WrapperAnimation)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    height: 80%;
    width: 80%;
  }
`;

const WrapperStatic = styled(WrapperGiftImg)`
  img {
    height: 50%;
    width: 50%;
  }
`;

GiftAnimation.propTypes = propTypes;
GiftAnimation.defaultProps = defaultProps;

export default GiftAnimation;
