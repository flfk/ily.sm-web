import { getTimestamp } from '../../../utils/Helpers';
import {
  createUserWithEmailAndPassword,
  fetchDocUser,
  fetchDocsOrders,
  fetchTotalComments,
  getCurrentUserID,
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

import { GEMS_PER_COMMENT } from '../../../utils/Constants';

const getFullUser = async userID => {
  const userDoc = await fetchDocUser(userID);

  const orders = await fetchDocsOrders(userID);
  const totalComments = userDoc.isVerified ? await fetchTotalComments(userDoc.username) : 0;

  const gemBalanceChangeComments = totalComments * GEMS_PER_COMMENT;
  const gemBalanceChangeOrders = orders.reduce((aggr, order) => aggr + order.gemBalanceChange, 0);
  const gemBalance = gemBalanceChangeComments + gemBalanceChangeOrders;

  return { ...userDoc, gemBalance, id: userID, orders, totalComments };
};

export const createUser = (email, password, username) => async dispatch => {
  dispatch({
    type: CREATE_USER.PENDING,
  });
  try {
    const user = await createUserWithEmailAndPassword(email, password);
    if (user) {
      const userDoc = {
        email,
        dateCreated: getTimestamp(),
        isVerified: false,
        profilePicURL: '',
        username,
      };
      const userAdded = await setDocUser(userDoc, user.uid);
      dispatch({
        type: CREATE_USER.SUCCESS,
        payload: { ...userAdded, id: user.uid },
      });
    }
  } catch (error) {
    dispatch({
      type: CREATE_USER.ERROR,
      payload: error.code,
    });
  }
};

export const logIn = (email, password) => async dispatch => {
  try {
    const user = await signInUser(email, password);
    const userFull = await getFullUser(user.uid);
    dispatch({
      type: LOGIN_USER.SUCCESS,
      payload: { ...userFull },
    });
  } catch (error) {
    dispatch({
      type: LOGIN_USER.ERROR,
      payload: error.code,
    });
  }
};

export const getLoggedInUser = () => async dispatch => {
  try {
    const userID = getCurrentUserID();
    const userFull = await getFullUser(userID);
    dispatch({
      type: GET_LOGGED_IN_USER.SUCCESS,
      payload: { ...userFull },
    });
  } catch (error) {
    console.log('Actions, user, getLoggedInUser');
    dispatch({
      type: GET_LOGGED_IN_USER.ERROR,
    });
  }
};

export const signOut = () => async dispatch => {
  dispatch({
    type: SIGNOUT_USER.PENDING,
  });
  try {
    await signOutUser();
    dispatch({
      type: SIGNOUT_USER.SUCCESS,
      payload: {},
    });
  } catch (error) {
    dispatch({
      type: SIGNOUT_USER.ERROR,
      payload: error.code,
    });
  }
};

export const updateUser = fieldsToUpdate => async dispatch => {
  try {
    console.log('NEED TO CONNECT UPDATEUSER TO FIRESTORE');
    console.log('user.actions updating fields', fieldsToUpdate);
    const userDocUpdated = await updateDocUser(fieldsToUpdate);
    dispatch({ type: UPDATE_USER.SUCCESS, payload: { ...userDocUpdated } });
  } catch (error) {
    console.error('Error actions user updateUser, ', error);
  }
};
