import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Btn from '../components/Btn';
import Content from '../components/Content';
import Currency from '../components/Currency';
import Popup from '../components/Popup';
import Spinner from '../components/Spinner';
import actions from '../data/actions';
import Fonts from '../utils/Fonts';
import { getFormattedNumber } from '../utils/Helpers';

import { signOut } from '../data/redux/user/user.actions';

const propTypes = {
  actionSignOut: PropTypes.func.isRequired,
  gemBalance: PropTypes.number,
  isVerified: PropTypes.bool,
  orders: PropTypes.array,
  totalComments: PropTypes.number,
  username: PropTypes.string,
};

const defaultProps = {
  gemBalance: 0,
  isVerified: false,
  totalComments: 0,
  orders: PropTypes.array,
  username: '',
};

const mapStateToProps = state => ({
  gemBalance: state.user.gemBalance,
  isVerified: state.user.isVerified,
  orders: state.user.orders,
  totalComments: state.user.totalComments,
  username: state.user.username,
});

const mapDispatchToProps = dispatch => ({
  actionSignOut: () => dispatch(signOut()),
});

class Profile extends React.Component {
  state = {
    itemsOrdered: [],
    isLoading: false,
  };

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (prevProps.orders.length === 0 && this.props.orders.length > 0) {
      this.setData();
    }
  }

  handleClose = () => this.props.history.goBack();

  handleSignOut = () => {
    const { actionSignOut } = this.props;
    actionSignOut();
    this.handleClose();
  };

  setData = async () => {
    const { orders } = this.props;
    const itemsOrdered = await Promise.all(
      orders
        .filter(order => order.itemID)
        .map(async order => {
          const item = await actions.fetchDocItem(order.itemID);
          return item;
        })
    );
    this.setState({ isLoading: false, itemsOrdered });
  };

  render() {
    const { isLoading } = this.state;
    const { gemBalance, isVerified, itemsOrdered, orders, totalComments, username } = this.props;

    if (isLoading) return <Spinner />;

    const verifiedStatus = isVerified ? (
      <div>
        <Fonts.H3 centered>
          <span role="img" aria-label="check">
            ✅
          </span>{' '}
          Instagram verified
        </Fonts.H3>
        <Fonts.H3 centered>
          {totalComments} <Fonts.P isSupporting>comments logged</Fonts.P>
        </Fonts.H3>
        <Content.Spacing8px />
        <Content.Seperator />
      </div>
    ) : (
      <div>
        <Fonts.H3 centered>Awaiting Verification</Fonts.H3>
        <Fonts.P centered>
          Within 48 hours of signing up we will verify your Instagram username by messaging you on
          Instagram.
        </Fonts.P>
        <Content.Spacing8px />
        <Fonts.P centered>
          Once you are verified you will be able to claim your gems from comments.
        </Fonts.P>
        <Content.Spacing8px />
        <Content.Seperator />
        <Content.Spacing8px />
      </div>
    );

    // let ordersDiv = null;
    // if (itemsOrdered) {
    //   const orderRows = orders
    //     .filter(order => order.itemID)
    //     .sort((a, b) => a.timestamp - b.timestamp)
    //     .map(order => {
    //       const itemOrdered = itemsOrdered.find(item => item.id === order.itemID);
    //       return <Fonts.P>{itemOrdered.name}</Fonts.P>;
    //     });
    //   ordersDiv = (
    //     <div>
    //       <Fonts.H3 centered>Prizes Ordered</Fonts.H3>
    //       {orderRows}
    //       <Content.Seperator />
    //     </div>
    //   );
    // }

    return (
      <Content>
        <Content.Spacing16px />
        <Popup.BtnClose handleClose={this.handleClose} />
        <Fonts.H2 centered>{username}</Fonts.H2>
        <Content.Seperator />
        {verifiedStatus}
        <Fonts.H3 centered>
          {getFormattedNumber(gemBalance.toFixed(0))} <Currency.GemsSingle small />
          <Fonts.P isSupporting>gems</Fonts.P>
        </Fonts.H3>
        <Content.Seperator centered />
        <Btn.Tertiary onClick={this.handleSignOut}>Sign Out</Btn.Tertiary>
      </Content>
    );
  }
}

Profile.propTypes = propTypes;
Profile.defaultProps = defaultProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
