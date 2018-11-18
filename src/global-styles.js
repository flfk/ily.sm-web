import { injectGlobal } from 'styled-components';
import LeckerliOne from './utils/LeckerliOne-Regular.ttf';
import Nunito from './utils/NunitoSans-Regular.ttf';
import PTSansNarrow from './utils/PT_Sans-Narrow-Web-Regular.ttf';

injectGlobal`
  @font-face {
    font-family: LeckerliOne;
    src: url(${LeckerliOne});
  }
  @font-face {
    font-family: Nunito;
    src: url(${Nunito})
  }
  @font-face {
    font-family: PTSansNarrow;
    src: url(${PTSansNarrow})
  }
`;
