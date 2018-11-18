import styled from 'styled-components';

import Colors from '../utils/Colors';
import Media from '../utils/Media';

const Footer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 8px 0;
  background-color: white;
  border-top: 1px solid ${Colors.greys.light};

  display: flex;
  justify-content: center;

  ${Media.tablet} {
    flex-direction: column;
    position-left: 0;
  }
`;

export default Footer;
