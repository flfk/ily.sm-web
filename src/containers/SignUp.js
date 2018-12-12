import React from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';

import Btn from '../components/Btn';
import Content from '../components/Content';
import InputText from '../components/InputText';
import Fonts from '../utils/Fonts';

const propTypes = {};
const defaultProps = {};

class SignUp extends React.Component {
  state = {
    email: '',
    emailErrMsg: '',
    emailIsValid: false,
    username: '',
    usernameErrMsg: '',
    usernameIsValid: false,
  };

  handleBlur = field => () => {
    let isValid = false;
    if (field === 'email') isValid = this.isEmailValid();
    if (field === 'username') isValid = this.isUsernameValid();
    const validFieldID = `${field}IsValid`;
    this.setState({ [validFieldID]: isValid });
  };

  handleChangeInput = field => event => this.setState({ [field]: event.target.value });

  handleSignUp = () => {};

  isEmailValid = () => {
    const { email } = this.state;
    if (!validator.isEmail(email)) {
      this.setState({ emailErrMsg: 'Valid email address required.' });
      return false;
    }
    this.setState({ emailErrMsg: '' });
    return true;
  };

  isUsernameValid = () => {
    const { username } = this.state;
    if (username === '') {
      this.setState({ usernameErrMsg: 'Instagram username required.' });
      return false;
    }
    this.setState({ usernameErrMsg: '' });
    return true;
  };

  render() {
    const {
      email,
      emailErrMsg,
      emailIsValid,
      username,
      usernameErrMsg,
      usernameIsValid,
    } = this.state;

    return (
      <Content>
        <Fonts.H1 centered>Sign up to claim your gems and get prizes.</Fonts.H1>
        <Content.Spacing />
        <InputText
          errMsg={emailErrMsg}
          label="Instagram email"
          placeholder="example@email.com"
          onBlur={this.handleBlur('email')}
          onChange={this.handleChangeInput('email')}
          value={email}
          isValid={emailIsValid}
        />
        <InputText
          errMsg={usernameErrMsg}
          label="Instagram username"
          placeholder="@myInstaAccount"
          onBlur={this.handleBlur('username')}
          onChange={this.handleChangeInput('username')}
          value={username}
          isValid={usernameIsValid}
        />
        <Content.Spacing8px />
        <Btn primary short onClick={this.handleSignUp}>
          Sign Up
        </Btn>
      </Content>
    );
  }
}

SignUp.propTypes = propTypes;
SignUp.defaultProps = defaultProps;

export default SignUp;
