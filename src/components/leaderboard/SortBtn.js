import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FaSortDown } from 'react-icons/fa';

import Colors from '../../utils/Colors';

const propTypes = {
  handleSort: PropTypes.func.isRequired,
  sortSelected: PropTypes.string.isRequired,
};

const defaultProps = {};

const SortBtn = ({ handleSort, sortSelected }) => {
  const sortText = sortSelected === 'current' ? 'This Week' : 'Last Week';

  return (
    <BtnSort onClick={handleSort}>
      <Selector>
        {sortText} <FaSortDown />
      </Selector>
    </BtnSort>
  );
};

const BtnSort = styled.button`
  display: flex;
  align-items: flex-start;
  padding: 0.5em 0.5em;
  border-radius: 3px;
  min-width: 116px;

  border: 1px solid ${Colors.greys.light};
  font-size: 16px;
  color: ${Colors.greys.supporting};
  background-color: transparent;
  cursor: pointer;

  :hover {
    background-color: ${Colors.greys.light};
    border-color: ${Colors.greys.supporting};
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

SortBtn.propTypes = propTypes;
SortBtn.defaultProps = defaultProps;

export default SortBtn;
