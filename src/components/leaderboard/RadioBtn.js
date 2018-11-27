import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Btn from '../Btn';
import Content from '../Content';
import Colors from '../../utils/Colors';
import Currency from '../Currency';

const propTypes = {
  handleCoins: PropTypes.func.isRequired,
  handleGems: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

const defaultProps = {};

class RadioBtn extends React.Component {
  state = {};

  render() {
    const { handleGems, handleCoins, type } = this.props;

    const isGems = type === 'gems';
    const isCoins = type === 'coins';

    return (
      <Content.Row alignCenter justifyCenter>
        <BtnRadio active={isGems} onClick={handleGems}>
          <Currency.GemsSingle tiny /> Gift Gems
        </BtnRadio>
        <Seperator />
        <BtnRadio active={isCoins} onClick={handleCoins}>
          <Content.Row alignCenter>
            <Currency.CoinsSingle tiny />
            <Content.Gap />
            Comment Coins
          </Content.Row>
        </BtnRadio>
      </Content.Row>
    );
  }
}

const BtnRadio = styled(Btn.Tertiary)`
  color: ${props => (props.active ? '' : Colors.greys.supporting)};
`;

const Seperator = styled.div`
  height: 16px;
  width: 1px;
  border-left: 1px solid ${Colors.greys.supporting};
`;

RadioBtn.propTypes = propTypes;
RadioBtn.defaultProps = defaultProps;

export default RadioBtn;
