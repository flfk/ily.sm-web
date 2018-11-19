import React from 'react';

import Btn from '../components/Btn';
import Content from '../components/Content';
import Currency from '../components/Currency';
import Fonts from '../utils/Fonts';
import InputText from '../components/InputText';

class checkout extends React.Component {
  state = {
    email: '',
    emailErrMsg: '',
    username: '',
    usernameErrMsg: '',
  };

  render() {
    const { email, emailErrMsg, username, usernameErrMsg } = this.state;

    return (
      <Content>
        <Fonts.H1 centered>Thanks for your gift!</Fonts.H1>
        <Fonts.H3 centered>You sent Jon XYZ</Fonts.H3>
        <Fonts.H3 centered>@username will recieve XXX gems</Fonts.H3>
        <Fonts.H3 centered>
          @username's new KlaasenNation top supporter rank is XXX{' '}
          <span role="img" aria-label="Party Popper">
            🎉
          </span>
        </Fonts.H3>
        <Btn primary short>
          Back to leaderboard
        </Btn>
        <Content.Spacing8px />
        <Btn.Tertiary>Give Jon another gift</Btn.Tertiary>
      </Content>
    );
  }
}

export default checkout;
