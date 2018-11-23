import PropTypes from 'prop-types';
import React from 'react';
import { FaSearch } from 'react-icons/fa';
import styled from 'styled-components';

import Colors from '../../utils/Colors';
import Media from '../../utils/Media';

const propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

const defaultProps = {
  placeholder: '',
};

const Container = styled.div`
  display: flex;
  flex-basis: 1;
  flex-grow: 1;
  margin-right: 8px;
  font-size: 14px;

  align-items: center;
  padding: 0.5em 0.5em;
  border-radius: 3px;
  border: 1px solid ${Colors.greys.light};
  font-size: 16px;
  color: ${Colors.greys.supporting};

  :focus-within {
    color: ${Colors.greys.primary};
    border-color: ${Colors.greys.supporting};
  }

  > svg {
    margin-right: 4px;
  }
`;

const Input = styled.input`
  height: 100%
  flex-basis: 1;
  color: ${Colors.greys.primary};
  font-size: 16px;
  border: none;

  ::placeholder {
    color: ${Colors.greys.supporting};
  }

  :focus {
    outline: none;
  }
`;

const SearchBar = ({ placeholder, onChange, value }) => {
  return (
    <Container>
      <FaSearch /> <Input placeholder={placeholder} onChange={onChange} value={value} />
    </Container>
  );
};

SearchBar.propTypes = propTypes;
SearchBar.defaultProps = defaultProps;

export default SearchBar;
