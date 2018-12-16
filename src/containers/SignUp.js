import mixpanel from 'mixpanel-browser';
import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import validator from 'validator';

import Btn from '../components/Btn';
import Content from '../components/Content';
import InputText from '../components/InputText';
import Popup from '../components/Popup';
import Spinner from '../components/Spinner';
import actions from '../data/actions';
import Fonts from '../utils/Fonts';
import { formatUsername, getParams } from '../utils/Helpers';

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
    isLoading: true,
    influencer: {},
    item: {},
    password: '',
    passwordErrMsg: '',
    passwordIsValid: false,
    showConfirmation: false,
    username: '',
    usernameErrMsg: '',
    usernameIsValid: false,
  };

  componentDidMount() {
    mixpanel.track('Visited Sign Up Page');
    this.setData();
  }

  getErrorText = errorCode => {
    if (errorCode === 'auth/email-already-in-use') {
      return 'You already have an account with this email. Try logging in.';
    }
    return "Oops, something wen't wrong. Please try again or contact us at ilydotsm@gmail.com for help.";
  };

  goToInsufficientGems = () => {
    const { influencerID, itemID } = this.state;
    const { message } = getParams(this.props);
    const messageParam = message ? `&message=${message}` : '';
    return (
      <Redirect
        push
        to={{
          pathname: '/insufficient',
          search: `?i=${influencerID}&itemID=${itemID}${messageParam}`,
        }}
      />
    );
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

  handleClose = () => this.props.history.goBack();

  handleSignUp = () => {
    this.setState({ isLoading: true });
    if (this.isFormValid()) {
      const { email, password, username } = this.state;
      const usernameFormatted = formatUsername(username);
      const { actionSignUp } = this.props;
      actionSignUp(email, password, usernameFormatted);
      mixpanel.alias(email);
      mixpanel.people.set({ username: usernameFormatted });
      mixpanel.track('Signed Up');
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

  setData = async () => {
    const { i, itemID } = getParams(this.props);
    if (i) {
      const influencer = await actions.fetchDocInfluencerByID(i);
      this.setState({ influencer });
    }
    if (itemID) {
      const item = await actions.fetchDocItem(itemID);
      this.setState({ item });
    }
    this.setState({ isLoading: false });
  };

  render() {
    const {
      email,
      emailErrMsg,
      emailIsValid,
      isLoading,
      item,
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

    if (showConfirmation && usernameRedux && !errorCode && item) this.goToInsufficientGems();

    if (showConfirmation && usernameRedux && !errorCode) {
      return (
        <Content>
          <Fonts.H1 centered> Welcome {usernameRedux}!</Fonts.H1>
          <Fonts.H3 centered>
            To verify your Instagram username we will message you on Instagram within 48 hours.
          </Fonts.H3>
          <Fonts.P centered>
            You won't be able claim gems earn't from comments until your account is verified.
          </Fonts.P>
          <Content.Spacing />
          <Btn primary short onClick={this.handleClose}>
            Done
          </Btn>
        </Content>
      );
    }

    const signUpErrMsg = errorCode ? (
      <Fonts.ERROR>{this.getErrorText(errorCode)}</Fonts.ERROR>
    ) : null;

    const title = item.name
      ? `Sign up to get a ${item.name}`
      : 'Sign up to claim your gems and get prizes.';

    return (
      <Content>
        <Content.Spacing16px />
        <Popup.BtnClose handleClose={this.handleClose} />
        <Fonts.H1 centered>{title}</Fonts.H1>
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
        <Content>
          <Fonts.FinePrint>
            By clicking on Sign Up, you agree with the{' '}
            <Link to="/termsConditions" target="_blank" style={{ textDecoration: 'none' }}>
              <Fonts.Link>Terms and Conditions of Use</Fonts.Link>
            </Link>{' '}
            and{' '}
            <Link to="/privacyPolicy" target="_blank" style={{ textDecoration: 'none' }}>
              <Fonts.Link>Privacy Policy</Fonts.Link>
            </Link>
            .
          </Fonts.FinePrint>
        </Content>
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
