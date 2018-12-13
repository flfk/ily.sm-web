import { auth, db } from '../../firebase';

const COLL_COMMENTERS = 'commenters';
const COLL_ORDERS = 'orders';
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

export const fetchDocsOrders = async userID => {
  const orders = [];
  const ordersRef = db.collection(COLL_ORDERS).where('userID', '==', userID);
  const snapshot = await ordersRef.get();
  snapshot.forEach(doc => {
    const order = doc.data();
    const { id } = doc;
    order.id = id;
    orders.push(order);
  });
  return orders;
};

export const fetchTotalComments = async username => {
  const commenters = [];
  const commentersRef = db.collection(COLL_COMMENTERS).where('username', '==', username);
  const snapshot = await commentersRef.get();
  snapshot.forEach(doc => {
    const commenter = doc.data();
    const { id } = doc;
    commenter.id = id;
    commenters.push(commenter);
  });
  const totalComments = commenters.reduce((aggr, commenter) => aggr + commenter.count, 0);
  return totalComments;
};

export const getCurrentUserID = () => {
  return auth.currentUser.uid;
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
