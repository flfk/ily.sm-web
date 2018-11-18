import styled from 'styled-components';
import COLORS from '../utils/Colors';

const NavBar = styled.ul`
  flex: 0 1 1160px;

  display: flex;
  align-items: center;

  margin: 0;
  padding: 0 8px;

  // logo
  li:first-child {
    margin-right: auto;

    a {
      color: ${COLORS.primary.red};
      text-decoration: none;
    }
  }

  // navLinks
  li {
    list-style: none;
  }

  li:not(:first-child) {

    a {
      padding: 14px 16px;
      height: 100%;
      color: ${COLORS.greys.primary};
      font-weight: bold;
      margin-right: 16px;
      font-size: 12px;
      text-decoration: none;
      white-space: nowrap;

      :hover {
        border-bottom: 2px solid ${COLORS.greys.primary};
      }

  }
`;
export default NavBar;
