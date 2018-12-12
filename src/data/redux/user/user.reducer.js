import { CREATE_USER, GET_LOGGED_IN_USER, LOGIN_USER, SIGNOUT_USER } from './user.types';

const initialState = {};

const reducerUser = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_USER.SUCCESS:
      console.log('create user success', action.payload);
      return {
        ...action.payload,
      };
    case GET_LOGGED_IN_USER.SUCCESS:
      return {
        ...action.payload,
      };
    case LOGIN_USER.SUCCESS:
      return {
        ...action.payload,
      };
    case SIGNOUT_USER.SUCCESS:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};

export default reducerUser;
