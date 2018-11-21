import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import scriptLoader from 'react-async-script-loader';
import paypal from 'paypal-checkout';

const propTypes = {
  commit: PropTypes.bool.isRequired,
  client: PropTypes.shape({
    sandbox: PropTypes.string,
    production: PropTypes.string,
  }).isRequired,
  currency: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  env: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
};

// const defaultProps = {};

class PaypalButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showButton: true,
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
    const {
      currency,
      description,
      env,
      commit,
      client,
      onSuccess,
      onError,
      onCancel,
      total,
    } = this.props;

    const { showButton } = this.state;

    const PayPalButton = paypal.Button.driver('react', { React, ReactDOM });

    const payment = () =>
      paypal.rest.payment.create(env, client, {
        transactions: [
          {
            amount: {
              total,
              currency,
            },
            description,
          },
        ],
      });

    const onAuthorize = (data, actions) =>
      actions.payment.execute().then(() => {
        const authorizedPayment = {
          paid: true,
          cancelled: false,
          payerID: data.payerID,
          paymentID: data.paymentID,
          paymentToken: data.paymentToken,
          returnUrl: data.returnUrl,
        };

        onSuccess(authorizedPayment);
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

PaypalButton.propTypes = propTypes;
// PaypalButton.defaultProps = defaultProps;

export default scriptLoader('https://www.paypalobjects.com/api/checkout.js')(PaypalButton);
