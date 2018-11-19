// import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import scriptLoader from 'react-async-script-loader';
import paypal from 'paypal-checkout';

// const propTypes = {};

// const defaultProps = {};

class PaypalButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showButton: true
    };

    window.React = React;
    window.ReactDOM = ReactDOM;
  }

  componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;

    if (isScriptLoaded && isScriptLoadSucceed) {
      this.setState({ showButton: true });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { isScriptLoaded, isScriptLoadSucceed } = nextProps;

    const isLoadedPreviouslyWasnt =
      !this.state.showButton && this.props.isScriptLoaded && isScriptLoaded;

    if (isLoadedPreviouslyWasnt && isScriptLoadSucceed) {
      this.setState({ showButton: true });
    }
  }

  render() {
    const { total, currency, env, commit, client, onSuccess, onError, onCancel } = this.props;

    const { showButton } = this.state;

    let PayPalButton = paypal.Button.driver('react', { React, ReactDOM });

    const payment = () =>
      paypal.rest.payment.create(env, client, {
        transactions: [
          {
            amount: {
              total,
              currency
            }
          }
        ]
      });

    const onAuthorize = (data, actions) =>
      actions.payment.execute().then(() => {
        const payment = {
          paid: true,
          cancelled: false,
          payerID: data.payerID,
          paymentID: data.paymentID,
          paymentToken: data.paymentToken,
          returnUrl: data.returnUrl
        };

        onSuccess(payment);
      });

    return (
      <div>
        {showButton && (
          <PayPalButton
            env={env}
            client={client}
            commit={commit}
            payment={payment}
            onAuthorize={onAuthorize}
            onCancel={onCancel}
            onError={onError}
            style={{ size: 'responsive' }}
          />
        )}
      </div>
    );
  }
}

// PaypalButton.propTypes = propTypes;
// PaypalButton.defaultProps = defaultProps;

export default scriptLoader('https://www.paypalobjects.com/api/checkout.js')(PaypalButton);
