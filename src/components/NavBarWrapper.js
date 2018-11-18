import styled from 'styled-components';
import COLORS from '../utils/Colors';

const NavBarWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  background-color: white;
  border-bottom: 1px solid ${COLORS.greys.light};
`;

export default NavBarWrapper;
