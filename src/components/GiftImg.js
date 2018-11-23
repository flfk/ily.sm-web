import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const propTypes = {
  large: PropTypes.bool,
  small: PropTypes.bool,
  src: PropTypes.string.isRequired,
};

const defaultProps = {
  large: false,
  small: false,
};

const ImgDiv = styled.div`
  height: ${props => (props.small ? '64px' : '80px')}
  width: ${props => (props.small ? '64px' : '80px')}
  ${props => (props.large ? 'height: 106px' : '')}
  ${props => (props.large ? 'width: 106px' : '')}
  background-image: url(${props => props.src});
  background-size: cover;
`;

const GiftImg = ({ large, small, src }) => <ImgDiv large={large} small={small} src={src} />;

GiftImg.propTypes = propTypes;
GiftImg.defaultProps = defaultProps;

export default GiftImg;
