import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaSortDown } from 'react-icons/fa';

import Colors from '../../utils/Colors';
import Darken from '../../utils/Darken';

const propTypes = {
  handleSort: PropTypes.func.isRequired,
  sortSelected: PropTypes.element.isRequired,
};

const defaultProps = {};

const BtnSort = styled.button`
  display: flex;
  align-items: center;
  // padding: 0.5em 0.5em;
  height: 38px;
  border-radius: 3px;
  min-width: 124px;

  border: 1px solid ${Colors.greys.light};
  font-size: 16px;
  color: ${Colors.greys.supporting};
  background-color: transparent;
  cursor: pointer;

  :hover {
    border-color: ${Darken('#ffffff')};
    background-color: ${Darken('#ffffff')};
  }

  :focus {
    outline: none;
  }
`;

const Selector = styled.div`
  margin-left: 4px;
  display: flex;
  align-items: center;
`;

const SortBtn = ({ handleSort, sortSelected }) => {
  return (
    <BtnSort onClick={handleSort}>
      Sort by{' '}
      <Selector>
        {sortSelected} <FaSortDown />
      </Selector>
    </BtnSort>
  );
};

SortBtn.propTypes = propTypes;
SortBtn.defaultProps = defaultProps;

export default SortBtn;
