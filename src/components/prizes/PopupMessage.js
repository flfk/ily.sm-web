import PropTypes from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';

import Btn from '../Btn';
import Content from '../Content';
import GiftImg from '../GiftImg';
import InputText from '../InputText';
import Popup from '../Popup';
import Fonts from '../../utils/Fonts';

const propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleItemOrder: PropTypes.func.isRequired,
  influencer: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
};

const defaultProps = {};

class PopupMessage extends React.Component {
  state = {
    message: '',
    messageErrMsg: '',
    messageIsValid: false,
  };

  handleBlur = field => () => {
    let isValid = false;
    if (field === 'message') isValid = this.isMessageValid();
    const validFieldID = `${field}IsValid`;
    this.setState({ [validFieldID]: isValid });
  };

  handleChangeInput = field => event => this.setState({ [field]: event.target.value });

  handleSendMessage = async () => {
    const { message } = this.state;
    const { handleClose, handleItemOrder, item } = this.props;
    const additionalFields = {
      message,
      reply: '',
    };
    handleItemOrder(item, additionalFields);
    handleClose();
  };

  isMessageValid = () => {
    const { message } = this.state;
    if (message === '') {
      this.setState({ messageErrMsg: "Don't forget to write a message." });
      return false;
    }
    this.setState({ messageErrMsg: '' });
    return true;
  };

  render() {
    const { message, messageErrMsg, messageIsValid } = this.state;
    const { handleClose, item, influencer } = this.props;

    return (
      <div>
        <Popup.BackgroundLight />
        <Popup.CardTransparent>
          <Content.Spacing16px />
          <Popup.BtnClose handleClose={handleClose} />
          <Fonts.H1 centered>Send {influencer.displayName} a message and get one back</Fonts.H1>
          <Content.Centered>
            <GiftImg src={item.imgURL} large />
          </Content.Centered>
          <Content.Spacing />
          <InputText.Area
            errMsg={messageErrMsg}
            label={`What do you want to say to ${influencer.displayName}?`}
            placeholder="Your message"
            onBlur={this.handleBlur('message')}
            onChange={this.handleChangeInput('message')}
            value={message}
            isValid={messageIsValid}
          />
          <Btn primary short onClick={this.handleSendMessage}>
            Send
          </Btn>
        </Popup.CardTransparent>
      </div>
    );
  }
}

PopupMessage.propTypes = propTypes;
PopupMessage.defaultProps = defaultProps;

export default PopupMessage;
