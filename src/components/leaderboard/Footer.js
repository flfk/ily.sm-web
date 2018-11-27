import React from 'react';
import PropTypes from 'prop-types';

import Btn from '../Btn';
import Content from '../Content';
import Footer from '../Footer';

const propTypes = {
  handleEarn: PropTypes.func.isRequired,
  currencyType: PropTypes.string.isRequired,
};

// const defaultProps = {};

const LeaderboardFooter = ({ handleEarn, currencyType }) => {
  const btnTxt = currencyType === 'coins' ? 'Earn Comment Coins' : 'Earn Gift Gems';
  return (
    <Footer>
      <Content>
        <Content.Spacing8px />
        <Btn primary short onClick={handleEarn}>
          {btnTxt}
        </Btn>
        <Content.Spacing8px />
      </Content>
    </Footer>
  );
};

LeaderboardFooter.propTypes = propTypes;

export default LeaderboardFooter;
