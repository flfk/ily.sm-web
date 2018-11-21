import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import Fonts from '../utils/Fonts';

const propTypes = {
  date: PropTypes.number.isRequired,
};

const defaultProps = {};

const INTERVAL_IN_MILLIS = 1000;

class Countdown extends React.Component {
  state = {
    days: 0,
    hours: 0,
    mins: 0,
    secs: 0,
  };

  componentDidMount() {
    const { date } = this.props;
    this.start(date);
  }

  componentDidUpdate(prevProps) {
    const { date } = this.props;
    if (date !== prevProps.date) {
      this.start(date);
    }
  }

  componentWillUnmount() {
    this.stop();
  }

  calculateCountdown = endDate => {
    let diff = (Date.parse(new Date(endDate)) - Date.parse(new Date())) / 1000;

    // clear countdown when date is reached
    if (diff <= 0) return false;

    const timeLeft = {
      years: 0,
      days: 0,
      hours: 0,
      mins: 0,
      secs: 0,
      millisecs: 0,
    };

    // calculate time difference between now and expected date
    if (diff >= 365.25 * 86400) {
      // 365.25 * 24 * 60 * 60
      timeLeft.years = Math.floor(diff / (365.25 * 86400));
      diff -= timeLeft.years * 365.25 * 86400;
    }
    if (diff >= 86400) {
      // 24 * 60 * 60
      timeLeft.days = Math.floor(diff / 86400);
      diff -= timeLeft.days * 86400;
    }
    if (diff >= 3600) {
      // 60 * 60
      timeLeft.hours = Math.floor(diff / 3600);
      diff -= timeLeft.hours * 3600;
    }
    if (diff >= 60) {
      timeLeft.mins = Math.floor(diff / 60);
      diff -= timeLeft.mins * 60;
    }
    timeLeft.secs = diff;

    return timeLeft;
  };

  start = date => {
    this.interval = setInterval(() => {
      const timeLeft = this.calculateCountdown(date);
      if (timeLeft) {
        this.setState({ ...timeLeft });
      } else {
        this.stop();
      }
    }, INTERVAL_IN_MILLIS);
  };

  stop = () => {
    clearInterval(this.interval);
  };

  addLeadingZeros = value => {
    let valueUpdated = String(value);
    while (valueUpdated.length < 2) {
      valueUpdated = `0${valueUpdated}`;
    }
    return valueUpdated;
  };

  render() {
    const { days, hours, mins, secs } = this.state;

    return (
      <Container>
        <div>
          <span>
            <H1 noMarginTop>{this.addLeadingZeros(days)}</H1>
            <Fonts.P>days</Fonts.P>
          </span>
        </div>

        <div>
          <span>
            <H1 noMarginTop>{this.addLeadingZeros(hours)}</H1>
            <Fonts.P>Hours</Fonts.P>
          </span>
        </div>

        <div>
          <span>
            <H1 noMarginTop>{this.addLeadingZeros(mins)}</H1>
            <Fonts.P>Mins</Fonts.P>
          </span>
        </div>

        <div>
          <span>
            <H1 noMarginTop>{this.addLeadingZeros(secs)}</H1>
            <Fonts.P>Secs</Fonts.P>
          </span>
        </div>
      </Container>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const H1 = styled(Fonts.H1)`
  margin-bottom: 4px;
`;

Countdown.propTypes = propTypes;

Countdown.defaultProps = defaultProps;

export default Countdown;
