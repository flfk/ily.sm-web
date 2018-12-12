import { createUserWithEmailAndPassword, fetchUser, signOutUser } from './user.api';
import { CREATE_USER, LOGIN_USER, GET_LOGGED_IN_USER, SIGNOUT_USER } from './user.types';

export const createUser = (email, password) => dispatch => {
  dispatch({
    type: CREATE_USER.PENDING,
  });
  createUserWithEmailAndPassword(email, password)
    .then(user => {
      dispatch({
        type: CREATE_USER.SUCCESS,
        payload: user,
      });
    })
    .catch(error => {
      dispatch({
        type: CREATE_USER.ERROR,
        payload: error.message,
      });
      const errorCode = error.code;
    });
};

export const login = (email, password) => dispatch => {
  dispatch({
    type: LOGIN_USER.PENDING,
  });
  fetchUser(email, password)
    .then(user => {
      dispatch({
        type: LOGIN_USER.SUCCESS,
        payload: user,
      });
    })
    .catch(error => {
      dispatch({
        type: LOGIN_USER.ERROR,
        payload: error.message,
      });
      console.log('Error actions user login, ', error);
      const errorCode = error.code;
      console.log('Error code is, ', errorCode);
    });
};

export const getLoggedInUser = user => dispatch => {
  dispatch({
    type: GET_LOGGED_IN_USER.SUCCESS,
    payload: user,
  });
};

export const signOut = () => dispatch => {
  dispatch({
    type: SIGNOUT_USER.PENDING,
  });
  signOutUser()
    .then(() => {
      dispatch({
        type: SIGNOUT_USER.SUCCESS,
        payload: {},
      });
    })
    .catch(error => {
      dispatch({
        type: SIGNOUT_USER.ERROR,
        payload: error.message,
      });
      console.log('Error actions sign out, ', error);
      const errorCode = error.code;
      console.log('Error code is, ', errorCode);
    });
};
