import PropTypes from 'prop-types';
import React from 'react';

import Btn from './Btn';
import Content from './Content';
import Fonts from '../utils/Fonts';

const propTypes = {
  handleThankFan: PropTypes.func.isRequired,
  handleUndo: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  wasThanked: PropTypes.bool.isRequired,
};

const defaultProps = {};

const DashboardRow = ({ handleThankFan, handleUndo, name, username, wasThanked }) => {
  const btn = wasThanked ? (
    <Btn.Tertiary narrow onClick={handleUndo}>
      Undo
    </Btn.Tertiary>
  ) : (
    <Btn primary narrow short onClick={handleThankFan}>
      Thank Fan
    </Btn>
  );

  return (
    <div>
      <Content.Row alignCenter>
        <Fonts.P>
          {name} from <strong>{username}</strong>
        </Fonts.P>
        {btn}
      </Content.Row>
      <Content.Spacing8px />
    </div>
  );
};

DashboardRow.propTypes = propTypes;
DashboardRow.defaultProps = defaultProps;

export default DashboardRow;
