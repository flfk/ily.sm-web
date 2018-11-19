import React from 'react';
import PropTypes from 'prop-types';

import Btn from '../Btn';
import Content from '../Content';
import Footer from '../Footer';

const propTypes = {
  handleEarnCoins: PropTypes.func.isRequired,
  handleEarnGems: PropTypes.func.isRequired,
};

// const defaultProps = {};

const LeaderboardFooter = ({ handleEarnCoins, handleEarnGems }) => {
  return (
    <Footer>
      <Content>
        <Content.Spacing8px />
        <Btn primary short onClick={handleEarnGems}>
          Earn Gift Gems
        </Btn>
        <Content.Spacing8px />
        <Btn.Tertiary onClick={handleEarnCoins}>Earn Comment Coins</Btn.Tertiary>
      </Content>
    </Footer>
  );
};

LeaderboardFooter.propTypes = propTypes;

export default LeaderboardFooter;
