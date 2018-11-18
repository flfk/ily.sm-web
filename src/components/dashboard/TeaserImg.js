import styled from 'styled-components';

import MEDIA from '../../utils/Media';

const TeaserImg = styled.div`
  height: 342px;
  width: 531px;
  align-self: center;

  img {
    height: 100%;
    width: 100%;
    border-radius: 5px;
  }

  ${MEDIA.tablet} {
    width: 300px;
    height: 192px;
  }
`;

export default TeaserImg;
