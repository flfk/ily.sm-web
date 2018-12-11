import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Btn from '../components/Btn';
import Icon from '../assets/icon.png';
import NavBarWrapper from '../components/NavBarWrapper';
import NavBarList from '../components/NavBarList';
import Wrapper from '../components/Wrapper';

const NavBar = () => (
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

// const NavBar = () => <div />;

export default NavBar;
