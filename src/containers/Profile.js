import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Btn from '../components/Btn';
import Content from '../components/Content';
import Fonts from '../utils/Fonts';
import GemPackRow from '../components/GemPackRow';
import actions from '../data/actions';
import Popup from '../components/Popup';

import { signOut } from '../data/redux/user/user.actions';

const propTypes = {
  actionSignOut: PropTypes.func.isRequired,
  user: PropTypes.object,
};

const defaultProps = {
  user: {},
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({
  actionSignOut: () => dispatch(signOut()),
});

const Profile = ({ actionSignOut, history, user }) => {
  console.log('user', user);

  const handleClose = () => {
    history.goBack();
  };

  const handleSignOut = () => {
    actionSignOut();
    handleClose();
  };

  return (
    <Content>
      <Content.Spacing16px />
      <Popup.BtnClose handleClose={handleClose} />
      <Fonts.H1 centered>{user.username}</Fonts.H1>
      <Btn onClick={handleSignOut}>Sign Out</Btn>
    </Content>
  );
};

Profile.propTypes = propTypes;
Profile.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
