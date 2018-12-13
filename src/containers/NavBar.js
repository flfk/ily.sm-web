import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Icon from '../assets/icon.png';
import Btn from '../components/Btn';
import NavBarWrapper from '../components/NavBarWrapper';
import NavBarList from '../components/NavBarList';
import Wrapper from '../components/Wrapper';

const propTypes = {
  user: PropTypes.object,
};

const defaultProps = {
  user: {},
};

const mapStateToProps = state => ({
  user: state.user,
});

const mapDispatchToProps = dispatch => ({});

const NavBar = ({ user }) => {
  const profileBtn = user.username ? (
    <li>
      <Link to="/profile">
        <Btn.Tertiary>{user.username}</Btn.Tertiary>
      </Link>
    </li>
  ) : null;

  const logInBtn = user.username ? null : (
    <li>
      <Link to="/login">
        <Btn.Tertiary narrow short primary>
          Log In
        </Btn.Tertiary>
      </Link>
    </li>
  );

  const signUpBtn = user.username ? null : (
    <li>
      <Link to="/signup">
        <Btn narrow short primary>
          Sign Up
        </Btn>
      </Link>
    </li>
  );

  return (
    <div>
      <NavBarWrapper>
        <NavBarList>
          <li>
            <Link to="/home">
              <Wrapper.Logo>
                <img src={Icon} alt="" />
              </Wrapper.Logo>
            </Link>
          </li>
          {profileBtn}
          {logInBtn}
          {signUpBtn}
        </NavBarList>
      </NavBarWrapper>
    </div>
  );
};

NavBar.propTypes = propTypes;
NavBar.defaultProps = defaultProps;

// const NavBar = () => <div />;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBar);
