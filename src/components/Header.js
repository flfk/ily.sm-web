import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Btn from './Btn';
import Content from './Content';
import Colors from '../utils/Colors';
import Fonts from '../utils/Fonts';
import Wrapper from './Wrapper';

const propTypes = {
  fandom: PropTypes.string.isRequired,
  profilePicURL: PropTypes.string.isRequired,
  selectedScreen: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};

const defaultProps = {};

const Header = ({ fandom, profilePicURL, selectedScreen, username }) => {
  return (
    <div>
      <Content.Row justifyCenter>
        <Container>
          <Wrapper.ProfilePic isLarge>
            <img src={profilePicURL} alt="Profile Pic" />
          </Wrapper.ProfilePic>
          <Fonts.H2>{fandom}</Fonts.H2>
        </Container>
      </Content.Row>
      <Content.Row>
        <NavBtn>
          <Link to={`/${username}`}>
            <BtnRadio isActive={selectedScreen === 'CurrentPost'}>CURRENT POST</BtnRadio>
          </Link>
        </NavBtn>
        <NavBtn>
          <Link to={`/halloffame?i=${username}`}>
            <BtnRadio isActive={selectedScreen === 'HallOfFame'}>HALL OF FAME</BtnRadio>
          </Link>
        </NavBtn>
        <NavBtn>
          <Link to={`/prizes?i=${username}`}>
            <BtnRadio isActive={selectedScreen === 'Prizes'}>PRIZES</BtnRadio>
          </Link>
        </NavBtn>
      </Content.Row>
      <Content.Seperator />
    </div>
  );
};

const Container = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BtnRadio = styled(Btn.Tertiary)`
  color: ${props => (props.isActive ? '' : Colors.greys.supporting)};
  font-weight: ${props => (props.isActive ? 'bold' : 'normal')};
`;

const NavBtn = styled.div`
  width: 80px;
`;

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
