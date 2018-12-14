import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import Btn from '../Btn';
import Content from '../Content';
import Currency from '../Currency';
import Footer from '../Footer';
import { GEMS_PER_COMMENT } from '../../utils/Constants';
import Fonts from '../../utils/Fonts';

const propTypes = {
  influencerName: PropTypes.string.isRequired,
  redirectPathname: PropTypes.string.isRequired,
};

// const defaultProps = {};

const LeaderboardFooter = ({ influencerName, redirectPathname }) => {
  const commentsPerGem = 1 / GEMS_PER_COMMENT;

  return (
    <Footer>
      <Content>
        <Content.Spacing8px />
        <Fonts.H3 centered noMargin>
          Collect your free gems <Currency.GemsSingle small />
        </Fonts.H3>
        <Content.Spacing8px />
        <Fonts.P centered>
          For every {commentsPerGem} comments on {influencerName}'s most recent
        </Fonts.P>
        <Content.Spacing8px />
        <Link to={`/${redirectPathname}`}>
          <Btn short fill="true">
            Claim your Gems
          </Btn>
        </Link>
        <Content.Spacing8px />
      </Content>
    </Footer>
  );
};

// const BtnContainer = styled.div`
//   margin-left: 32px;
//   margin-right: 32px;
// `;

LeaderboardFooter.propTypes = propTypes;

export default LeaderboardFooter;
