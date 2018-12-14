import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Btn from '../components/Btn';
import Content from '../components/Content';
import Fonts from '../utils/Fonts';

const propTypes = {};

const defaultProps = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

class Verification extends React.Component {
  state = {
    users: [{ username: 'test', id: 'abc', isVerified: false }],
  };

  handleVerify = event => {
    const { users } = this.state;
    const userID = event.target.value;
    const usersUpdated = users.slice();
    const userIndex = users.map(user => user.id).indexOf(userID);
    const userPrev = usersUpdated[userIndex];
    usersUpdated[userIndex] = { ...userPrev, isVerified: !userPrev.isVerified };
    this.setState({ users: usersUpdated });
  };

  render() {
    const { users } = this.state;

    const verificationRows = users.map(user => {
      const { id, isVerified } = user;
      const btn = isVerified ? (
        <Btn.Tertiary value={id} onClick={this.handleVerify}>
          Verified
        </Btn.Tertiary>
      ) : (
        <Btn primary narrow short value={id} onClick={this.handleVerify}>
          Verify
        </Btn>
      );
      return (
        <Content.Row alignCenter key={id}>
          <div>
            <Fonts.P>
              <strong>username</strong>
            </Fonts.P>
            <Fonts.P>email</Fonts.P>
          </div>
          {btn}
        </Content.Row>
      );
    });

    return (
      <Content>
        <Fonts.H1>Verification for users</Fonts.H1>
        {verificationRows}
      </Content>
    );
  }
}

Verification.propTypes = propTypes;
Verification.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Verification);
