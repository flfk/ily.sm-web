import { auth, db } from './firebase';
// import { storage } from './firebase';

// Collection and document Names
const COLL_COMMENTERS = 'commenters';
const COLL_GEM_PACKS = 'gemPacks';
const COLL_GIFT_OPTIONS = 'giftOptions';
const COLL_INFLUENCERS = 'influencers';
const COLL_ITEMS = 'items';
const COLL_POSTS = 'posts';
const COLL_ORDERS = 'orders';
// const COLL_TXNS = 'txns';
const COLL_UTILS = 'utils';

const DOC_LAST_ORDER = 'lastOrder';

const addDocOrder = async order => {
  const newOrder = await db.collection(COLL_ORDERS).add(order);
  return newOrder;
};

// const addDocTxn = async txn => {
//   const newTxn = await db.collection(COLL_TXNS).add(txn);
//   return newTxn;
// };

const fetchDocsCommenters = async postID => {
  const commenters = [];
  try {
    const commentersRef = db
      .collection(COLL_POSTS)
      .doc(postID)
      .collection(COLL_COMMENTERS);
    const snapshot = await commentersRef.get();
    snapshot.forEach(doc => {
      const commenter = doc.data();
      const { id } = doc;
      commenter.id = id;
      commenters.push(commenter);
    });
  } catch (error) {
    console.error('Error actions, fetchDocsCommenters', error);
  }
  return commenters;
};

const fetchDocsPosts = async influencerID => {
  const posts = [];
  try {
    const postsRef = db.collection(COLL_POSTS);
    const snapshot = await postsRef.where('influencerID', '==', influencerID).get();
    const postsWOCommenters = [];
    snapshot.forEach(doc => {
      const post = doc.data();
      const { id } = doc;
      post.id = id;
      postsWOCommenters.push(post);
    });
    await Promise.all(
      postsWOCommenters.map(async postWOCommenters => {
        const commenters = await fetchDocsCommenters(postWOCommenters.id);
        posts.push({ ...postWOCommenters, commenters });
      })
    );
  } catch (error) {
    console.error('Error actions, fetchDocsPosts', error);
  }
  return posts;
};

const fetchDocGemPack = async gemPackID => {
  let gemPack = {};
  try {
    const gemPackRef = db.collection(COLL_GEM_PACKS).doc(gemPackID);
    const snapshot = await gemPackRef.get();
    gemPack = snapshot.data();
    gemPack.id = snapshot.id;
  } catch (error) {
    console.error('Error actions, fetchDocGemPack', error);
  }
  return gemPack;
};

const fetchDocGift = async giftID => {
  let gift = {};
  try {
    const giftRef = db.collection(COLL_GIFT_OPTIONS).doc(giftID);
    const snapshot = await giftRef.get();
    gift = snapshot.data();
    gift.id = snapshot.id;
  } catch (error) {
    console.error('Error actions, fetchDocGift', error);
  }
  return gift;
};

const fetchDocItem = async itemID => {
  let item = {};
  try {
    const itemRef = db.collection(COLL_ITEMS).doc(itemID);
    const snapshot = await itemRef.get();
    item = snapshot.data();
    item.id = snapshot.id;
  } catch (error) {
    console.error('Error actions, fetchDocItem', error);
  }
  return item;
};

const fetchDocInfluencerByID = async influencerID => {
  let influencer = {};
  try {
    const influencerRef = db.collection(COLL_INFLUENCERS).doc(influencerID);
    const snapshot = await influencerRef.get();
    influencer = snapshot.data();
    influencer.id = snapshot.id;
  } catch (error) {
    console.error('Error actions, fetchDocInfluencerByID', error);
  }
  return influencer;
};

const fetchDocInfluencerByField = async (field, value) => {
  let influencer = {};
  try {
    const influencerRef = db.collection(COLL_INFLUENCERS);
    const snapshot = await influencerRef
      .where(field, '==', value)
      .limit(1)
      .get();
    snapshot.forEach(doc => {
      influencer = doc.data();
      const { id } = doc;
      influencer.id = id;
    });
  } catch (error) {
    console.error('Error actions, fetchDocInfluencerByField', error);
  }
  return influencer;
};

const fetchDocOrder = async orderID => {
  let order = {};
  try {
    const orderRef = db.collection(COLL_ORDERS).doc(orderID);
    const snapshot = await orderRef.get();
    order = snapshot.data();
    order.id = snapshot.id;
  } catch (error) {
    console.error('Error actions, fetchDocOrder', error);
  }
  return order;
};

const fetchDocsGiftOptions = async influencerID => {
  const giftOptions = [];
  try {
    const giftOptionsRef = db.collection(COLL_GIFT_OPTIONS);
    const snapshot = await giftOptionsRef.where('influencerID', '==', influencerID).get();
    snapshot.forEach(doc => {
      const option = doc.data();
      const { id } = doc;
      option.id = id;
      giftOptions.push(option);
    });
  } catch (error) {
    console.error('Error actions, fetchDocsGiftOptions', error);
  }
  return giftOptions;
};

const fetchDocPostByField = async (field, value) => {
  let post = {};
  try {
    const postRef = db.collection(COLL_POSTS);
    const snapshot = await postRef
      .where(field, '==', value)
      .limit(1)
      .get();
    let postWOCommenters = {};
    snapshot.forEach(doc => {
      postWOCommenters = doc.data();
      const { id } = doc;
      postWOCommenters.id = id;
    });
    const commenters = await fetchDocsCommenters(postWOCommenters.id);
    post = { ...postWOCommenters, commenters };
  } catch (error) {
    console.error('Error actions, fetchDocPostByField', error);
  }
  return post;
};

const fetchDocsGemPacks = async () => {
  const gemPacks = [];
  try {
    const gemPacksRef = db.collection(COLL_GEM_PACKS);
    const snapshot = await gemPacksRef.get();
    snapshot.forEach(doc => {
      const pack = doc.data();
      const { id } = doc;
      pack.id = id;
      gemPacks.push(pack);
    });
  } catch (error) {
    console.error('Error actions, fetchDocsGemPacks', error);
  }
  return gemPacks;
};

const fetchDocsInfluencers = async () => {
  const influencers = [];
  try {
    const influencersRef = db.collection(COLL_INFLUENCERS);
    const snapshot = await influencersRef.get();
    snapshot.forEach(doc => {
      const option = doc.data();
      const { id } = doc;
      option.id = id;
      influencers.push(option);
    });
  } catch (error) {
    console.error('Error actions, fetchDocsInfluencers', error);
  }
  return influencers;
};

const fetchDocsItems = async influencerID => {
  const items = [];
  try {
    const itemsRef = db.collection(COLL_ITEMS);
    const snapshot = await itemsRef.where('influencerID', '==', influencerID).get();
    snapshot.forEach(doc => {
      const item = doc.data();
      const { id } = doc;
      item.id = id;
      items.push(item);
    });
  } catch (error) {
    console.error('Error actions, fetchDocsItems', error);
  }
  return items;
};

const fetchDocsOrders = async influencerID => {
  const orders = [];
  try {
    const ordersRef = db.collection(COLL_ORDERS);
    const snapshot = await ordersRef.where('influencerID', '==', influencerID).get();
    snapshot.forEach(doc => {
      const order = doc.data();
      const { id } = doc;
      order.id = id;
      orders.push(order);
    });
  } catch (error) {
    console.error('Error actions, fetchDocsOrders', error);
  }
  return orders;
};

// const fetchDocsTxns = async (dateMin, influencerID) => {
//   const txns = [];
//   try {
//     const txnsRef = db.collection(COLL_TXNS);
//     const snapshot = await txnsRef
//       .where('influencerID', '==', influencerID)
//       .where('timestamp', '>', dateMin)
//       .get();
//     snapshot.forEach(doc => {
//       const txn = doc.data();
//       const { id } = doc;
//       txn.id = id;
//       txns.push(txn);
//     });
//   } catch (error) {
//     console.error('Error actions, fetchDocsTxns', error);
//   }
//   return txns;
// };

const fetchOrderNum = async () => {
  const lastOrderRef = db.collection(COLL_UTILS).doc(DOC_LAST_ORDER);
  const snapshot = await lastOrderRef.get();
  const data = await snapshot.data();
  const newOrderNum = data.orderNum + 1;
  await lastOrderRef.set({ orderNum: newOrderNum });
  return data.orderNum + 1;
};

const updateDocOrder = async (orderID, order) => {
  try {
    const orderRef = db.collection(COLL_ORDERS).doc(orderID);
    const updatedDocOrder = orderRef.update({ ...order });
    return updatedDocOrder;
  } catch (error) {
    console.error('Error actions, updateDocOrder ', error);
  }
  return {};
};

// AUTHENTICATION
const createUserWithEmailAndPassword = async (email, password) => {
  let errorCode = null;
  try {
    await auth.createUserWithEmailAndPassword(email, password);
  } catch (error) {
    console.error('Error actions, createUserWithEmailAndPassword ', error);
    errorCode = error.code;
  }
  return errorCode;
};

const fetchUser = async () => {
  let user = {};
  try {
    user = auth.currentUser;
  } catch (error) {
    console.error('Error actions, fetchUser ', error);
  }
  return user;
};

// EXPORTS
const actions = {};

actions.addDocOrder = addDocOrder;
// actions.addDocTxn = addDocTxn;
actions.fetchDocGemPack = fetchDocGemPack;
actions.fetchDocGift = fetchDocGift;
actions.fetchDocItem = fetchDocItem;
actions.fetchDocInfluencerByID = fetchDocInfluencerByID;
actions.fetchDocInfluencerByField = fetchDocInfluencerByField;
actions.fetchDocPostByField = fetchDocPostByField;
actions.fetchDocOrder = fetchDocOrder;
actions.fetchDocsGiftOptions = fetchDocsGiftOptions;
actions.fetchDocsGemPacks = fetchDocsGemPacks;
actions.fetchDocsInfluencers = fetchDocsInfluencers;
actions.fetchDocsItems = fetchDocsItems;
actions.fetchDocsPosts = fetchDocsPosts;
actions.fetchDocsOrders = fetchDocsOrders;
// actions.fetchDocsTxns = fetchDocsTxns;
actions.fetchOrderNum = fetchOrderNum;
actions.updateDocOrder = updateDocOrder;

actions.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
actions.fetchUser = fetchUser;

export default actions;
