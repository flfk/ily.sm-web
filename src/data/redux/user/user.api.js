import { auth, db } from '../../firebase';

const COLL_USERS = 'users';

export const createUserWithEmailAndPassword = async (email, password) => {
  let user = {};
  try {
    const data = await auth.createUserWithEmailAndPassword(email, password);
    user = data.user;
  } catch (error) {
    console.error('Error actions, createUserWithEmailAndPassword ', error);
  }
  return user;
};

export const fetchDisplayName = async () => {
  const displayName = await auth.currentUser.displayName;
  return displayName;
};

export const fetchDocUser = async userID => {
  let user = {};
  try {
    const userRef = db.collection(COLL_USERS).doc(userID);
    const snapshot = await userRef.get();
    user = snapshot.data();
    user.id = snapshot.id;
  } catch (error) {
    console.error('Error actions, fetchDocUser', error);
  }
  return user;
};

export const signInUser = async (email, password) => {
  const data = await auth.signInWithEmailAndPassword(email, password);
  return data.user;
};

export const signOutUser = async () => {
  await auth.signOut();
};

export const setDocUser = async (user, userID) => {
  let setUser = {};
  try {
    setUser = await db
      .collection(COLL_USERS)
      .doc(userID)
      .set(user);
  } catch (error) {
    console.error('Error actions, setDocUser ', error);
  }
  return setUser;
};

export const updateDocUser = async fieldsToUpdate => {
  let updatedUser = {};
  try {
    const { currentUser } = auth;
    console.log('user.api, current user is', currentUser);
    const userRef = db.collection(COLL_USERS).doc(currentUser.uid);
    updatedUser = userRef.update(fieldsToUpdate);
  } catch (error) {
    console.error('Error actions, updateDocUser ', error);
  }
  return updatedUser;
};
