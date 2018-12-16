import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const propTypes = {
  isLarge: PropTypes.bool,
  isSmall: PropTypes.bool,
  src: PropTypes.string.isRequired,
};

const defaultProps = {
  isLarge: false,
  isSmall: false,
};

const ImgDiv = styled.div`
  height: ${props => (props.isSmall ? '32px' : '80px')}
  width: ${props => (props.isSmall ? '32px' : '80px')}
  ${props => (props.isLarge ? 'height: 106px' : '')}
  ${props => (props.isLarge ? 'width: 106px' : '')}
  background-image: url(${props => props.src});
  background-size: cover;
`;

const itemImg = ({ isLarge, isSmall, src }) => (
  <ImgDiv isLarge={isLarge} isSmall={isSmall} src={src} />
);

itemImg.propTypes = propTypes;
itemImg.defaultProps = defaultProps;

export default itemImg;
