import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Coin0 from '../../assets/Coin0.png';
import Coin1 from '../../assets/Coin1.png';
import Coin2 from '../../assets/Coin2.png';
import Coin3 from '../../assets/Coin3.png';

const propTypes = {
  small: PropTypes.bool,
};

const defaultProps = {
  small: false,
};

const ImgDiv = styled.div`
  display: inline-block;
  height: 48px;
  width: 48px;
  background-image: url(${props => props.img});
  background-size: cover;
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

const Few = () => <ImgDiv img={Coin1} />;

const Some = () => <ImgDiv img={Coin2} />;

const Many = () => <ImgDiv img={Coin3} />;

const Coin = {};
Coin.Icon = Icon;
Coin.Few = Few;
Coin.Some = Some;
Coin.Many = Many;

export default Coin;
