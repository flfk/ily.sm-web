import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const propTypes = {
  small: PropTypes.bool,
  src: PropTypes.string.isRequired,
};

const defaultProps = {
  small: false,
};

const ImgDiv = styled.div`
  height: ${props => (props.small ? '64px' : '80px')}
  width: ${props => (props.small ? '64px' : '80px')}
  background-image: url(${props => props.src});
  background-size: cover;
`;

const GiftImg = ({ small, src }) => <ImgDiv small={small} src={src} />;

GiftImg.propTypes = propTypes;
GiftImg.defaultProps = defaultProps;

export default GiftImg;
