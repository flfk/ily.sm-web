import { CREATE_USER, GET_LOGGED_IN_USER, LOGIN_USER, SIGNOUT_USER } from './user.types';

const initialState = {
  errorCode: '',
  isPending: false,
};

const reducerUser = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_USER.PENDING:
      return {
        ...state,
        isPending: true,
      };
    case CREATE_USER.SUCCESS:
      console.log('create user success', action.payload);
      return {
        ...state,
        ...action.payload,
        errorCode: '',
        isPending: false,
      };
    case CREATE_USER.ERROR:
      return {
        ...state,
        errorCode: action.payload,
        isPending: false,
      };
    case GET_LOGGED_IN_USER.SUCCESS:
      return {
        ...state,
        ...action.payload,
        errorCode: '',
      };
    case LOGIN_USER.PENDING:
      console.log('log in user pending', action.payload);
      return {
        ...state,
        errorCode: '',
        isPending: true,
      };
    case LOGIN_USER.SUCCESS:
      return {
        ...state,
        ...action.payload,
        errorCode: '',
        isPending: false,
      };
    case LOGIN_USER.ERROR:
      return {
        ...state,
        errorCode: action.payload,
        isPending: false,
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
