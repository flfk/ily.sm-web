import styled from 'styled-components';

const Logo = styled.div`
  height: 32px;
  width: 32px;

  img {
    height: 100%;
    width: 100%;
    border-radius: 5px;
  }
`;

const Post = styled.div`
  height: ${props => (props.isLarge ? '144px' : '106px')};
  width: ${props => (props.isLarge ? '144px' : '106px')};

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
Wrapper.Logo = Logo;
Wrapper.Post = Post;
Wrapper.ProfileImage = ProfileImage;
Wrapper.ProfilePic = ProfilePic;

export default Wrapper;
