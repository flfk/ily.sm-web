import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Btn from '../components/Btn';
import Content from '../components/Content';
import Fonts from '../utils/Fonts';
import Popup from '../components/Popup';

import { signOut } from '../data/redux/user/user.actions';

const propTypes = {
  actionSignOut: PropTypes.func.isRequired,
  isVerified: PropTypes.bool,
  username: PropTypes.string,
};

const defaultProps = {
  isVerified: false,
  username: '',
};

const mapStateToProps = state => ({
  isVerified: state.user.isVerified,
  username: state.user.username,
});

const mapDispatchToProps = dispatch => ({
  actionSignOut: () => dispatch(signOut()),
});

const Profile = ({ actionSignOut, history, isVerified, username }) => {
  const handleClose = () => {
    history.goBack();
  };

  const handleSignOut = () => {
    actionSignOut();
    handleClose();
  };

  const verifiedStatus = isVerified ? (
    <div>
      <Fonts.H3 centered>
        <span role="img" aria-label="check">
          ✅
        </span>{' '}
        Instagram verified
      </Fonts.H3>
      <Content.Spacing8px />
      <Content.Seperator />
    </div>
  ) : (
    <div>
      <Fonts.H3 centered>Awaiting Verification</Fonts.H3>
      <Fonts.P centered>
        Within 48 hours of signing up we will verify your Instagram username by messaging you on
        Instagram. Once you are verified you will be able to claim your gems and get prizes.
      </Fonts.P>
      <Content.Spacing8px />
      <Content.Seperator />
      <Content.Spacing8px />
    </div>
  );

  return (
    <Content>
      <Content.Spacing16px />
      <Popup.BtnClose handleClose={handleClose} />
      <Fonts.H2 centered>{username}</Fonts.H2>
      <Content.Seperator />
      {verifiedStatus}
      <Btn.Tertiary onClick={handleSignOut}>Sign Out</Btn.Tertiary>
    </Content>
  );
};

Profile.propTypes = propTypes;
Profile.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
