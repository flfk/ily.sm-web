import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Coin0 from '../assets/Coin0.png';
import Coin1 from '../assets/Coin1.png';
import Coin2 from '../assets/Coin2.png';
import Coin3 from '../assets/Coin3.png';

import Gem0 from '../assets/Gem0.png';
import Gem3 from '../assets/Gem3.png';

const propTypes = {
  small: PropTypes.bool,
  large: PropTypes.bool,
  tiny: PropTypes.bool,
};

const defaultProps = {
  small: false,
  large: false,
  tiny: false,
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
  ${props => (props.tiny ? 'height: 14px' : '')}
  ${props => (props.tiny ? 'width: 14px' : '')}
  background-image: url(${props => props.img});
  background-size: cover;
`;

const CoinsSingle = ({ small, tiny }) => <IconDiv img={Coin0} small={small} tiny={tiny} />;

CoinsSingle.propTypes = propTypes;
CoinsSingle.defaultProps = defaultProps;

const CoinsFew = ({ large }) => <ImgDiv img={Coin1} large={large} />;

CoinsFew.propTypes = propTypes;
CoinsFew.defaultProps = defaultProps;

const CoinsSome = ({ large }) => <ImgDiv img={Coin2} large={large} />;

CoinsSome.propTypes = propTypes;
CoinsSome.defaultProps = defaultProps;

const CoinsMany = ({ large }) => <ImgDiv img={Coin3} large={large} />;

CoinsMany.propTypes = propTypes;
CoinsMany.defaultProps = defaultProps;

const GemsSingle = ({ small }) => <IconDiv img={Gem0} small={small} />;

GemsSingle.propTypes = propTypes;
GemsSingle.defaultProps = defaultProps;

const GemsMany = ({ large }) => <ImgDiv img={Gem3} large={large} />;

GemsMany.propTypes = propTypes;
GemsMany.defaultProps = defaultProps;

const Currency = {};
Currency.CoinsSingle = CoinsSingle;
Currency.CoinsFew = CoinsFew;
Currency.CoinsSome = CoinsSome;
Currency.CoinsMany = CoinsMany;
Currency.GemsSingle = GemsSingle;
Currency.GemsMany = GemsMany;

export default Currency;
