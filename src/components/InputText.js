import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Colors from '../utils/Colors';
import Media from '../utils/Media';

const propTypes = {
  errMsg: PropTypes.string,
  isValid: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  noMargin: PropTypes.bool,
  value: PropTypes.string.isRequired,
};

const defaultProps = {
  errMsg: '',
  isValid: null,
  label: '',
  onBlur: null,
  noMargin: false,
  placeholder: '',
};

const InputText = ({ errMsg, label, isValid, onChange, onBlur, noMargin, placeholder, value }) => {
  const errLabel = errMsg ? <ErrLabel>{errMsg}</ErrLabel> : null;

  const hasError = errMsg.length > 0;

  return (
    <Container>
      <Label>{label}</Label>
      <Input
        hasError={hasError}
        isValid={isValid}
        onChange={onChange}
        onBlur={onBlur}
        noMargin={noMargin}
        type="text"
        placeholder={placeholder}
        value={value}
      />
      {errLabel}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  font-size: 14px;

  ${Media.tablet} {
    width: auto;
    margin: 0;
  }
`;

const Label = styled.label`
  color: ${Colors.greys.secondary};
  margin-bottom: 8px;
  display: inline-block;
`;

const Input = styled.input`
  padding: 0.5em 0.5em;
  border-radius: 3px;
  border: 1px solid ${Colors.greys.light};
  font-size: 14px;
  color: ${Colors.greys.primary};

  margin-bottom: ${props => (props.hasError ? '8px' : '16px')};
  border-color: ${props => (props.hasError ? Colors.error.primary : '')};
  border-color: ${props => (props.isValid ? Colors.primary.green : '')};

  ::placeholder {
    color: ${Colors.greys.supporting};
  }

  :focus {
    border: 1px solid ${Colors.primary.green};
    outline: none;
  }
`;

const ErrLabel = styled(Label)`
  color: ${Colors.error.primary};
  margin-bottom: 16px;
  font-weight: bold;
`;

InputText.ErrLabel = ErrLabel;

InputText.propTypes = propTypes;
InputText.defaultProps = defaultProps;

export default InputText;
