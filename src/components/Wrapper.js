import styled from 'styled-components';

// import Media from '../utils/Media';

// const EventImage = styled.div`
//   height: 300px;
//   width: 500px;
//   // margin-bottom: 24px;

//   img {
//     height: 100%;
//     width: 100%;
//     border-radius: 5px;
//   }

//   ${Media.tablet} {
//     width: auto;
//     height: auto;
//   }
// `;

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

const ProfileImgLarge = styled.div`
  height: 80px;
  width: 80px;
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
Wrapper.ProfileImgLarge = ProfileImgLarge;

export default Wrapper;
