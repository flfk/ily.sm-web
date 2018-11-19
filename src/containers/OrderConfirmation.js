import React from 'react';
import { Redirect } from 'react-router-dom';

import Btn from '../components/Btn';
import Content from '../components/Content';
import Currency from '../components/Currency';
import Fonts from '../utils/Fonts';
import InputText from '../components/InputText';

class OrderConfirmation extends React.Component {
  state = {
    toLeaderboard: false,
  };

  goToLeaderboard = () => (
    <Redirect
      push
      to={{
        pathname: '/jon_klaasen',
      }}
    />
  );

  handleToLeaderboard = () => this.setState({ toLeaderboard: true });

  render() {
    const { toLeaderboard } = this.state;

    if (toLeaderboard) return this.goToLeaderboard();

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
        <Btn primary short onClick={this.handleToLeaderboard}>
          Back to leaderboard
        </Btn>
      </Content>
    );
  }
}

export default OrderConfirmation;
