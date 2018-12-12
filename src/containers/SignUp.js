import React from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';

import Btn from '../components/Btn';
import Content from '../components/Content';
import InputText from '../components/InputText';
import Spinner from '../components/Spinner';
import actions from '../data/actions';
import Fonts from '../utils/Fonts';

const propTypes = {};
const defaultProps = {};

class SignUp extends React.Component {
  state = {
    email: '',
    emailErrMsg: '',
    emailIsValid: false,
    isLoading: false,
    password: '',
    passwordErrMsg: '',
    passwordIsValid: false,
    showConfirmation: false,
    username: '',
    usernameErrMsg: '',
    usernameIsValid: false,
  };

  handleBlur = field => () => {
    let isValid = false;
    if (field === 'email') isValid = this.isEmailValid();
    if (field === 'password') isValid = this.isPasswordValid();
    if (field === 'username') isValid = this.isUsernameValid();
    const validFieldID = `${field}IsValid`;
    this.setState({ [validFieldID]: isValid });
  };

  handleChangeInput = field => event => this.setState({ [field]: event.target.value });

  handleDone = () => this.props.history.goBack();

  handleSignUp = () => {
    this.setState({ isLoading: true });
    if (this.isFormValid()) {
      const { email, password, username } = this.state;
      actions.createUserWithEmailAndPassword(email, password);
      // XX TODO
      // Need to create a user object with 'isVerified' and 'username'
      this.setState({ showConfirmation: true });
    }
    this.setState({ isLoading: false });
  };

  isFormValid = () => {
    if (this.isEmailValid() && this.isPasswordValid() && this.isUsernameValid()) {
      return true;
    }
    return false;
  };

  isEmailValid = () => {
    const { email } = this.state;
    if (!validator.isEmail(email)) {
      this.setState({ emailErrMsg: 'Valid email address required.' });
      return false;
    }
    this.setState({ emailErrMsg: '' });
    return true;
  };

  isPasswordValid = () => {
    const { password } = this.state;
    if (password.length < 6) {
      this.setState({ passwordErrMsg: 'Your password needs to be at least 6 characters.' });
      return false;
    }
    this.setState({ passwordErrMsg: '' });
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
      isLoading,
      password,
      passwordErrMsg,
      passwordIsValid,
      showConfirmation,
      username,
      usernameErrMsg,
      usernameIsValid,
    } = this.state;

    if (isLoading) return <Spinner />;

    if (showConfirmation) {
      return (
        <Content>
          <Fonts.H1 centered> Welcome {username}!</Fonts.H1>
          <Fonts.H3 centered>
            To verify your Instagram username we will message you on Instagram within 48 hours.
          </Fonts.H3>
          <Fonts.P centered>
            You won't be able to get or spend gems until your account is verified. We apologize for
            any inconvenience.
          </Fonts.P>
          <Content.Spacing />
          <Btn primary short onClick={this.handleDone}>
            Done
          </Btn>
        </Content>
      );
    }

    return (
      <Content>
        <Fonts.H1 centered>Sign up to claim your gems and get prizes.</Fonts.H1>
        <Content.Spacing />
        <InputText
          errMsg={emailErrMsg}
          label="Tell us your email"
          placeholder="example@email.com"
          onBlur={this.handleBlur('email')}
          onChange={this.handleChangeInput('email')}
          value={email}
          isValid={emailIsValid}
        />
        <InputText
          errMsg={usernameErrMsg}
          label="What's your Instagram username?"
          placeholder="@myInstaAccount"
          onBlur={this.handleBlur('username')}
          onChange={this.handleChangeInput('username')}
          value={username}
          isValid={usernameIsValid}
        />
        <InputText
          errMsg={passwordErrMsg}
          label="Create a Password"
          placeholder="Password"
          onBlur={this.handleBlur('password')}
          onChange={this.handleChangeInput('password')}
          value={password}
          isPassword
          isValid={passwordIsValid}
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
