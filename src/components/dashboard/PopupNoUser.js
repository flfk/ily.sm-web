import React from 'react';
import PropTypes from 'prop-types';
import { FaSearch } from 'react-icons/fa';

import actions from '../../data/actions';
import Btn from '../Btn';
import Fonts from '../../utils/Fonts';
import InputText from '../InputText';
import Popup from '../Popup';
import TeaserImg from './TeaserImg';

const propTypes = {
  handleChangeUsername: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  influencerName: PropTypes.string.isRequired,
  influencerUsername: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  usernameErrMsg: PropTypes.string,
};

const defaultProps = {
  usernameErrMsg: '',
};

class PopupNoUser extends React.Component {
  state = {
    teaserImgURL: '',
  };

  componentDidMount() {
    this.loadTeaserImg();
  }

  loadTeaserImg = async () => {
    const { influencerUsername } = this.props;
    const teaserImgURL = await actions.fetchDashboardTeaserImgURL(influencerUsername);
    this.setState({ teaserImgURL });
  };

  render() {
    const { teaserImgURL } = this.state;

    const {
      handleChangeUsername,
      handleSearch,
      influencerName,
      username,
      usernameErrMsg,
    } = this.props;

    return (
      <div>
        <Popup.BackgroundLight />
        <Popup.CardTransparent>
          <Fonts.H1 centered>
            Find out if you're in {influencerName}
            's most active fans
          </Fonts.H1>
          <TeaserImg>
            <img src={teaserImgURL} alt={influencerName} />
          </TeaserImg>
          <InputText
            onChange={handleChangeUsername}
            errMsg={usernameErrMsg}
            value={username}
            placeholder="@YourInstagramUsername"
          />
          <Btn primary fill="true" onClick={handleSearch}>
            <FaSearch /> Search
          </Btn>
        </Popup.CardTransparent>
      </div>
    );
  }
}

PopupNoUser.propTypes = propTypes;
PopupNoUser.defaultProps = defaultProps;

export default PopupNoUser;
