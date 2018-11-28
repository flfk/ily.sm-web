import PropTypes from 'prop-types';
import React from 'react';

import Btn from './Btn';
import Content from './Content';
import Fonts from '../utils/Fonts';

const propTypes = {
  handleSelect: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  wasOpened: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
};

const defaultProps = {};

const DashboardRow = ({ handleSelect, name, username, wasOpened, value }) => {
  const btn = wasOpened ? (
    <Btn.Tertiary narrow onClick={handleSelect} value={value}>
      See Gift
    </Btn.Tertiary>
  ) : (
    <Btn primary narrow short onClick={handleSelect} value={value}>
      Open Gift
    </Btn>
  );

  const text = wasOpened ? (
    <Fonts.P>
      {name} from <strong>{username}</strong>
    </Fonts.P>
  ) : (
    <Fonts.P>
      From <strong>{username}</strong>
    </Fonts.P>
  );

  return (
    <div>
      <Content.Row alignCenter>
        {text}
        {btn}
      </Content.Row>
      <Content.Spacing8px />
    </div>
  );
};

DashboardRow.propTypes = propTypes;
DashboardRow.defaultProps = defaultProps;

export default DashboardRow;
