import styled from 'styled-components';

const ProfileImage = styled.div`
  height: 40px;
  width: 40px;

  margin-right: 8px;

  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
  }
`;

const ProfilePic = styled.div`
  height: ${props => (props.isLarge ? '80px' : '40px')};
  width: ${props => (props.isLarge ? '80px' : '40px')};
  align-self: center;

  margin: 16px;

  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
  }
`;

const Wrapper = {};
// Wrapper.EventImage = EventImage;
Wrapper.ProfileImage = ProfileImage;
Wrapper.ProfilePic = ProfilePic;

export default Wrapper;
