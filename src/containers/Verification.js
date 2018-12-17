import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import Btn from '../components/Btn';
import Content from '../components/Content';
import Spinner from '../components/Spinner';
import actions from '../data/actions';
import Fonts from '../utils/Fonts';

const ADMIN_ACCOUNT = 'ilydotsm';

const propTypes = {
  username: PropTypes.string,
};

const defaultProps = {
  username: '',
};

const mapStateToProps = state => ({
  username: state.user.username,
});

const mapDispatchToProps = dispatch => ({});

class Verification extends React.Component {
  state = {
    isLoading: true,
    users: [],
  };

  componentDidMount() {
    this.setData();
  }

  handleVerify = event => {
    const { users } = this.state;
    const userID = event.target.value;
    const usersUpdated = users.slice();
    const userIndex = users.map(user => user.id).indexOf(userID);
    const userPrev = usersUpdated[userIndex];
    actions.updateDocUser(userID, { isVerified: !userPrev.isVerified });
    usersUpdated[userIndex] = { ...userPrev, isVerified: !userPrev.isVerified };
    this.setState({ users: usersUpdated });
  };

  setData = async () => {
    const users = await actions.fetchDocsUsers();
    this.setState({ isLoading: false, users });
  };

  render() {
    const { isLoading, users } = this.state;
    const { username } = this.props;

    if (isLoading) return <Spinner />;

    const rowData = username === ADMIN_ACCOUNT ? users : [];

    const verificationRows = rowData
      .sort((a, b) => {
        if (a.username < b.username) {
          return -1;
        }
        if (a.username > b.username) {
          return 1;
        }
        return 0;
      })
      .map(user => {
        const { email, id, isVerified, username } = user;
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
          <div key={id}>
            <Content.Row alignCenter>
              <div>
                <Fonts.P>
                  <strong>{username}</strong>
                </Fonts.P>
                <Fonts.P>{email}</Fonts.P>
              </div>
              {btn}
            </Content.Row>
            <Content.Spacing16px />
          </div>
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
