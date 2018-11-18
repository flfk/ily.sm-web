import React from 'react';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';

import Btn from './Btn';
import Content from './Content';
import Footer from './Footer';

const propTypes = {
  handleClaimPoints: PropTypes.func.isRequired,
};

// const defaultProps = {};

const LeaderboardFooter = ({ handleClaimPoints }) => {
  return (
    <Footer>
      <Content>
        <br />
        <Btn primary onClick={handleClaimPoints}>
          <FaSearch /> Search My Username
        </Btn>
        <br />
      </Content>
    </Footer>
  );
};

LeaderboardFooter.propTypes = propTypes;

export default LeaderboardFooter;
