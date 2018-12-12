import { auth } from '../../firebase';

export const createUserWithEmailAndPassword = async (email, password) => {
  let errorCode = null;
  try {
    await auth.createUserWithEmailAndPassword(email, password);
  } catch (error) {
    console.error('Error actions, createUserWithEmailAndPassword ', error);
    errorCode = error.code;
  }
  return errorCode;
};

export const fetchDisplayName = async () => {
  const displayName = await auth.currentUser.displayName;
  return displayName;
};

export const fetchUser = async (email, password) => {
  const data = await auth.signInWithEmailAndPassword(email, password);
  return data.user;
};

export const signOutUser = async () => {
  await auth.signOut();
};
