import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Colors from '../utils/Colors';
import Media from '../utils/Media';

const propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  errMsg: PropTypes.string,
  noMargin: PropTypes.bool,
};

const defaultProps = {
  label: '',
  placeholder: '',
  errMsg: '',
  noMargin: false,
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
  margin-bottom: ${props => (props.noMargin ? '0' : '16px')};
  border: 1px solid ${Colors.greys.light};
  font-size: 14px;
  color: ${Colors.greys.primary};

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

const InputText = props => {
  const { value, label, onChange, placeholder, errMsg, noMargin } = props;

  const errLabel = errMsg ? <ErrLabel>{errMsg}</ErrLabel> : null;

  const input = noMargin ? (
    <Input type="text" onChange={onChange} placeholder={placeholder} value={value} noMargin />
  ) : (
    <Input type="text" onChange={onChange} placeholder={placeholder} value={value} />
  );

  return (
    <Container>
      <Label>{label}</Label>
      {input}
      {errLabel}
    </Container>
  );
};

InputText.ErrLabel = ErrLabel;

InputText.propTypes = propTypes;
InputText.defaultProps = defaultProps;

export default InputText;
