import { auth, db } from '../../firebase';

const COLL_USERS = 'users';

export const createUserWithEmailAndPassword = async (email, password) => {
  const data = await auth.createUserWithEmailAndPassword(email, password);
  return data.user;
};

export const fetchDisplayName = async () => {
  const displayName = await auth.currentUser.displayName;
  return displayName;
};

export const fetchDocUser = async userID => {
  const userRef = db.collection(COLL_USERS).doc(userID);
  const snapshot = await userRef.get();
  const user = snapshot.data();
  user.id = snapshot.id;
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
  const setUser = await db
    .collection(COLL_USERS)
    .doc(userID)
    .set(user);
  return setUser;
};

export const updateDocUser = async fieldsToUpdate => {
  const { currentUser } = auth;
  console.log('user.api, current user is', currentUser);
  const userRef = db.collection(COLL_USERS).doc(currentUser.uid);
  const updatedUser = userRef.update(fieldsToUpdate);
  return updatedUser;
};
