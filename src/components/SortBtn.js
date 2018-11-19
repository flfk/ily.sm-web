import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaSortDown } from 'react-icons/fa';

import Colors from '../utils/Colors';
import Darken from '../utils/Darken';
import Media from '../utils/Media';

const propTypes = {
  handleSort: PropTypes.func.isRequired,
  sortSelected: PropTypes.element.isRequired,
};

const defaultProps = {};

const BtnSort = styled.button`
  display: flex;
  align-items: center;
  // padding: 0.5em 0.5em;
  height: 54px;
  border-radius: 3px;
  min-width: 124px;

  border: 1px solid ${Colors.greys.light};
  font-size: 16px;
  color: ${Colors.greys.supporting};
  background-color: transparent;
  cursor: pointer;

  > div {
    margin-left: 4px;
  }

  :hover {
    border-color: ${Darken('#ffffff')};
    background-color: ${Darken('#ffffff')};
  }

  :focus {
    outline: none;
  }
`;

const SortBtn = ({ handleSort, sortSelected }) => {
  return (
    <BtnSort onClick={handleSort}>
      Sort by{' '}
      <div>
        {sortSelected} <FaSortDown />
      </div>
    </BtnSort>
  );
};

SortBtn.propTypes = propTypes;
SortBtn.defaultProps = defaultProps;

export default SortBtn;
