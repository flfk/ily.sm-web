import styled from 'styled-components';

const Post = styled.div`
  height: 144px;
  width: 144px;

  img {
    height: 100%;
    width: 100%;
    border-radius: 5px;
  }
`;

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
  height: ${props => (props.isLarge ? '80px' : '32px')};
  width: ${props => (props.isLarge ? '80px' : '32px')};
  align-self: center;

  img {
    height: 100%;
    width: 100%;
    border-radius: 50%;
  }
`;

const Wrapper = {};
Wrapper.Post = Post;
Wrapper.ProfileImage = ProfileImage;
Wrapper.ProfilePic = ProfilePic;

export default Wrapper;
