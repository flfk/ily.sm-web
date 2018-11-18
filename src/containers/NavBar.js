import React from 'react';
import { Link } from 'react-router-dom';

import FONTS from '../utils/Fonts';
import NavBarWrapper from '../components/NavBarWrapper';
import NavBarList from '../components/NavBarList';

// const NavBar = () => (
//   <div>
//     <NavBarWrapper>
//       <NavBarList>
//         <li>
//           <Link to="/">
//             <FONTS.LOGO>Meetsta</FONTS.LOGO>
//           </Link>
//         </li>
//         <li>
//           <Link to="/events">FAQ</Link>
//         </li>
//         <li>
//           <Link to="/">Host an event</Link>
//         </li>
//         <li>
//           <Link to="/events">Contact</Link>
//         </li>
//       </NavBarList>
//     </NavBarWrapper>
//   </div>
// );

const NavBar = () => (
  <div>
    <NavBarWrapper>
      <NavBarList>
        <li>
          <Link to="/">
            <FONTS.LOGO>Meetsta</FONTS.LOGO>
          </Link>
        </li>
        <li>
          <Link to="/contactUs">Contact Us</Link>
        </li>
      </NavBarList>
    </NavBarWrapper>
  </div>
);

export default NavBar;
