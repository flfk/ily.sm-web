import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Btn from '../components/Btn';
import Content from '../components/Content';
import Currency from '../components/Currency';
import Popup from '../components/Popup';
import Fonts from '../utils/Fonts';
import { getFormattedNumber } from '../utils/Helpers';

import { signOut } from '../data/redux/user/user.actions';

const propTypes = {
  actionSignOut: PropTypes.func.isRequired,
  gemBalance: PropTypes.number,
  isVerified: PropTypes.bool,
  totalComments: PropTypes.number,
  username: PropTypes.string,
};

const defaultProps = {
  gemBalance: 0,
  isVerified: false,
  totalComments: 0,
  username: '',
};

const mapStateToProps = state => ({
  gemBalance: state.user.gemBalance,
  isVerified: state.user.isVerified,
  totalComments: state.user.totalComments,
  username: state.user.username,
});

const mapDispatchToProps = dispatch => ({
  actionSignOut: () => dispatch(signOut()),
});

const Profile = ({ actionSignOut, gemBalance, history, isVerified, totalComments, username }) => {
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
      <Fonts.H3 centered>
        {totalComments} <Fonts.P isSupporting>comments logged</Fonts.P>
      </Fonts.H3>
      <Content.Spacing8px />
      <Content.Seperator />
    </div>
  ) : (
    <div>
      <Fonts.H3 centered>Awaiting Verification</Fonts.H3>
      <Fonts.P centered>
        Within 48 hours of signing up we will verify your Instagram username by messaging you on
        Instagram.
      </Fonts.P>
      <Content.Spacing8px />
      <Fonts.P centered>
        Once you are verified you will be able to claim your gems from comments.
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
      <Fonts.H3 centered>
        {getFormattedNumber(gemBalance.toFixed(0))} <Currency.GemsSingle small />
        <Fonts.P isSupporting>gems</Fonts.P>
      </Fonts.H3>
      <Content.Seperator centered />
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
