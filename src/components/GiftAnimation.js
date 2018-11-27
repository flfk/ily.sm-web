import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Content from './Content';
import Gift from '../assets/Gift.png';
import GiftOpen from '../assets/GiftOpen.gif';

const propTypes = {};

const defaultProps = {};

const GiftAnimation = props => {
  return (
    <Content.Row justifyCenter>
      <Wrapper>
        <img src={GiftOpen} alt="" />
      </Wrapper>
      <Wrapper>
        <img src={Gift} alt="" />
      </Wrapper>
    </Content.Row>
  );
};

const Wrapper = styled.div`
  border: 1px solid red;
  height: 180px;
  width: 180px;

  img {
    height: 100%;
    width: 100%;
  }
`;

const Wrapper = styled.div`
  border: 1px solid red;
  height: 180px;
  width: 180px;

  img {
    height: 100%;
    width: 100%;
  }
`;

GiftAnimation.propTypes = propTypes;
GiftAnimation.defaultProps = defaultProps;

export default GiftAnimation;
