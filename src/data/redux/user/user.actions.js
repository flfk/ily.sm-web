import {
  createUserWithEmailAndPassword,
  fetchDocUser,
  setDocUser,
  signInUser,
  signOutUser,
  updateDocUser,
} from './user.api';
import {
  CREATE_USER,
  LOGIN_USER,
  GET_LOGGED_IN_USER,
  SIGNOUT_USER,
  UPDATE_USER,
} from './user.types';

export const createUser = (email, password, username) => dispatch => {
  createUserWithEmailAndPassword(email, password)
    .then(user => {
      const userID = user.uid;
      const userDoc = {
        email,
        isVerified: false,
        profilePicURL: '',
        username,
      };
      setDocUser(userDoc, userID);
      console.log('user created', userDoc);
      dispatch({
        type: CREATE_USER.SUCCESS,
        payload: { ...userDoc, id: userID },
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

export const logIn = (email, password) => dispatch => {
  dispatch({
    type: LOGIN_USER.PENDING,
  });
  signInUser(email, password)
    .then(user => {
      const userID = user.uid;
      fetchDocUser(userID).then(userDoc => {
        dispatch({
          type: LOGIN_USER.SUCCESS,
          payload: { ...userDoc, id: userID },
        });
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

export const updateUser = fieldsToUpdate => dispatch => {
  updateDocUser(fieldsToUpdate)
    .then(() => {
      console.log('user.actions updating fields', fieldsToUpdate);
      dispatch({ type: UPDATE_USER.SUCCESS, payload: fieldsToUpdate });
    })
    .catch(error => {
      console.error('Error actions user updateDisplayName, ', error);
    });
};
