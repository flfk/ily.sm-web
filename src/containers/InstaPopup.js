import React from 'react';

import Btn from '../components/Btn';
import Content from '../components/Content';
import Fonts from '../utils/Fonts';
import { getParams } from '../utils/Helpers';
import Spinner from '../components/Spinner';

class InstaPopup extends React.Component {
  state = {};

  componentDidMount() {}

  getCode = () => {
    const { code } = getParams(this.props);
    return code;
  };

  render() {
    return (
      <Content>
        <Spinner />
        <Fonts.H1 centered>Logging In</Fonts.H1>
      </Content>
    );
  }
}

export default InstaPopup;
