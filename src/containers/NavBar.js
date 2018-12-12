import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Icon from '../assets/icon.png';
import Btn from '../components/Btn';
import NavBarWrapper from '../components/NavBarWrapper';
import NavBarList from '../components/NavBarList';
import Wrapper from '../components/Wrapper';
import actions from '../data/actions';

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

class NavBar extends React.Component {
  componentDidMount() {
    this.setUser();
  }

  setUser = async () => {
    const user = await actions.fetchUser();
    this.setState({ user });
  };

  render() {
    const { user } = this.props;
    console.log(user);
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
            <li>
              <Link to="/signup">
                <Btn narrow short primary>
                  Sign Up
                </Btn>
              </Link>
            </li>
          </NavBarList>
        </NavBarWrapper>
      </div>
    );
  }
}

NavBar.propTypes = propTypes;
NavBar.defaultProps = defaultProps;

// const NavBar = () => <div />;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBar);
