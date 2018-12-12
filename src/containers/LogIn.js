import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import validator from 'validator';

import Btn from '../components/Btn';
import Content from '../components/Content';
import InputText from '../components/InputText';
import Spinner from '../components/Spinner';
import Fonts from '../utils/Fonts';

import { logIn } from '../data/redux/user/user.actions';

const propTypes = {
  actionLogIn: PropTypes.func.isRequired,
};

const defaultProps = {};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  actionLogIn: (email, password, username) => dispatch(logIn(email, password)),
});

class LogIn extends React.Component {
  state = {
    email: '',
    emailErrMsg: '',
    emailIsValid: false,
    isLoading: false,
    password: '',
    passwordErrMsg: '',
    passwordIsValid: false,
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
      const { email, password } = this.state;
      const { actionLogIn } = this.props;
      actionLogIn(email, password);
      this.handleDone();
    }
    this.setState({ isLoading: false });
  };

  isFormValid = () => {
    if (this.isEmailValid() && this.isPasswordValid()) {
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
    if (password === '') {
      this.setState({ passwordErrMsg: "Don't forget to type in your password." });
      return false;
    }
    this.setState({ passwordErrMsg: '' });
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
    } = this.state;

    if (isLoading) return <Spinner />;

    return (
      <Content>
        <Fonts.H1 centered>Log into your ily.sm account</Fonts.H1>
        <InputText
          errMsg={emailErrMsg}
          placeholder="Email"
          onBlur={this.handleBlur('email')}
          onChange={this.handleChangeInput('email')}
          value={email}
          isValid={emailIsValid}
        />
        <InputText
          errMsg={passwordErrMsg}
          placeholder="Password"
          onBlur={this.handleBlur('password')}
          onChange={this.handleChangeInput('password')}
          value={password}
          isPassword
          isValid={passwordIsValid}
        />
        <Content.Spacing8px />
        <Btn primary short onClick={this.handleSignUp}>
          Log In
        </Btn>
      </Content>
    );
  }
}

LogIn.propTypes = propTypes;
LogIn.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogIn);
