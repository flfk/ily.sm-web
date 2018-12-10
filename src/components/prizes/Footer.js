import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Btn from '../Btn';
import Content from '../Content';
import Currency from '../Currency';
import Footer from '../Footer';
import Fonts from '../../utils/Fonts';

const propTypes = {
  influencerName: PropTypes.string.isRequired,
};

// const defaultProps = {};

const LeaderboardFooter = ({ influencerName }) => {
  return (
    <Footer>
      <Content>
        <Content.Spacing8px />
        <Fonts.H3 centered noMargin>
          Collect your free gems <Currency.GemsSingle small />
        </Fonts.H3>
        <Content.Spacing8px />
        <Fonts.P centered>For every 100 comments on {influencerName}'s most recent</Fonts.P>
        <Content.Spacing8px />
        <Link to={`/socookiecutters`}>
          <Btn short fill="true">
            Claim your Gems
          </Btn>
        </Link>
        <Content.Spacing8px />
      </Content>
    </Footer>
  );
};

LeaderboardFooter.propTypes = propTypes;

export default LeaderboardFooter;
