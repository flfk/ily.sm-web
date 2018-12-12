import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Icon from '../assets/icon.png';
import Btn from '../components/Btn';
import NavBarWrapper from '../components/NavBarWrapper';
import NavBarList from '../components/NavBarList';
import Wrapper from '../components/Wrapper';
import actions from '../data/actions';

class NavBar extends React.Component {
  state = {
    user: {},
  };

  componentDidMount() {
    this.setUser();
  }

  setUser = async () => {
    const user = await actions.fetchUser();
    this.setState({ user });
  };

  render() {
    const { user } = this.state;
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

// const NavBar = () => <div />;

export default NavBar;
