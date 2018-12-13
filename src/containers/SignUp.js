import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import validator from 'validator';

import Btn from '../components/Btn';
import Content from '../components/Content';
import InputText from '../components/InputText';
import Spinner from '../components/Spinner';
import Fonts from '../utils/Fonts';

import { createUser } from '../data/redux/user/user.actions';

const propTypes = {
  actionSignUp: PropTypes.func.isRequired,
  errorCode: PropTypes.string,
  isPending: PropTypes.bool,
  usernameRedux: PropTypes.string,
};

const defaultProps = {
  errorCode: '',
  isPending: false,
  usernameRedux: '',
};

const mapStateToProps = state => ({
  errorCode: state.user.errorCode,
  isPending: state.user.isPending,
  usernameRedux: state.user.username,
});

const mapDispatchToProps = dispatch => ({
  actionSignUp: (email, password, username) => dispatch(createUser(email, password, username)),
});

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

  getErrorText = errorCode => {
    if (errorCode === 'auth/email-already-in-use') {
      return 'You already have an account with this email. Try logging in.';
    }
    return "Oops, something wen't wrong. Please try again or contact us at ilydotsm@gmail.com for help.";
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
      const { actionSignUp } = this.props;
      actionSignUp(email, password, username);
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

    const { errorCode, isPending, usernameRedux } = this.props;

    if (isLoading || isPending) return <Spinner />;

    if (showConfirmation && usernameRedux && !errorCode) {
      return (
        <Content>
          <Fonts.H1 centered> Welcome {usernameRedux}!</Fonts.H1>
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

    const signUpErrMsg = errorCode ? (
      <Fonts.ERROR>{this.getErrorText(errorCode)}</Fonts.ERROR>
    ) : null;

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
        {signUpErrMsg}
        <Btn primary short onClick={this.handleSignUp}>
          Sign Up
        </Btn>
      </Content>
    );
  }
}

SignUp.propTypes = propTypes;
SignUp.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
