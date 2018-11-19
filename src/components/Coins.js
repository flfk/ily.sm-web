import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Coin0 from '../assets/Coin0.png';
import Coin1 from '../assets/Coin1.png';
import Coin2 from '../assets/Coin2.png';
import Coin3 from '../assets/Coin3.png';

const propTypes = {
  small: PropTypes.bool,
  large: PropTypes.bool,
};

const defaultProps = {
  small: false,
  large: false,
};

const ImgDiv = styled.div`
  display: inline-block;
  height: 48px;
  width: 48px;
  background-image: url(${props => props.img});
  background-size: cover;
  height: ${props => (props.large ? '80px' : '')}
  width: ${props => (props.large ? '80px' : '')}
`;

const IconDiv = styled(ImgDiv)`
  display: inline-block;
  height: ${props => (props.small ? '24px' : '40px')}
  width: ${props => (props.small ? '24px' : '40px')}
  background-image: url(${props => props.img});
  background-size: cover;
`;

const Icon = ({ small }) => <IconDiv img={Coin0} small={small} />;

Icon.propTypes = propTypes;
Icon.defaultProps = defaultProps;

const Few = ({ large }) => <ImgDiv img={Coin1} large={large} />;

const Some = ({ large }) => <ImgDiv img={Coin2} large={large} />;

const Many = ({ large }) => <ImgDiv img={Coin3} large={large} />;

const Coin = {};
Coin.Icon = Icon;
Coin.Few = Few;
Coin.Some = Some;
Coin.Many = Many;

export default Coin;
