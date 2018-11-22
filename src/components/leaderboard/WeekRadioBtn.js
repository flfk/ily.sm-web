import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Btn from '../Btn';
import Content from '../Content';
import Colors from '../../utils/Colors';

const propTypes = {
  handleCurrent: PropTypes.func.isRequired,
  handleLast: PropTypes.func.isRequired,
  weekType: PropTypes.string.isRequired,
};

const defaultProps = {};

class WeekRadioBtn extends React.Component {
  state = {};

  render() {
    const { handleCurrent, handleLast, weekType } = this.props;

    const isCurrent = weekType === 'current';
    const isLast = weekType === 'last';

    return (
      <Content.Row alignCenter justifyCenter>
        <RadioBtn active={isCurrent} onClick={handleCurrent}>
          This Week's Progress
        </RadioBtn>
        <Seperator />
        <RadioBtn active={isLast} onClick={handleLast}>
          Last Week's Winners
        </RadioBtn>
      </Content.Row>
    );
  }
}

const RadioBtn = styled(Btn.Tertiary)`
  color: ${props => (props.active ? '' : Colors.greys.supporting)};
`;

const Seperator = styled.div`
  height: 16px;
  width: 1px;
  border-left: 1px solid ${Colors.greys.supporting};
`;

WeekRadioBtn.propTypes = propTypes;
WeekRadioBtn.defaultProps = defaultProps;

export default WeekRadioBtn;
