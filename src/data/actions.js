import { db } from './firebase';
// import { storage } from './firebase';

// Collection and document Names
const COLL_GIFT_OPTIONS = 'giftOptions';
const COLL_COMMENTS = 'comments';
const COLL_INFLUENCERS = 'influencers';
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

const fetchCollComments = async postID => {
  const comments = [];
  try {
    const commentsRef = db
      .collection(COLL_POSTS)
      .doc(postID)
      .collection(COLL_COMMENTS);
    const snapshot = await commentsRef.get();
    snapshot.forEach(doc => {
      const comment = doc.data();
      const { id } = doc;
      comment.id = id;
      comments.push(comment);
    });
  } catch (error) {
    console.error('Error actions, fetchCollComments', error);
  }
  return comments;
};

const fetchCollPosts = async influencerID => {
  const posts = [];
  try {
    const postsRef = db.collection(COLL_POSTS);
    const snapshot = await postsRef.where('influencerID', '==', influencerID).get();
    const postsWOComments = [];
    snapshot.forEach(doc => {
      const post = doc.data();
      const { id } = doc;
      post.id = id;
      postsWOComments.push(post);
    });
    await Promise.all(
      postsWOComments.map(async postWOComments => {
        const comments = await fetchCollComments(postWOComments.id);
        posts.push({ ...postWOComments, comments });
      })
    );
  } catch (error) {
    console.error('Error actions, fetchCollPosts', error);
  }
  return posts;
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
    let postWOComments = {};
    snapshot.forEach(doc => {
      postWOComments = doc.data();
      const { id } = doc;
      postWOComments.id = id;
    });
    const comments = await fetchCollComments(postWOComments.id);
    post = { ...postWOComments, comments };
  } catch (error) {
    console.error('Error actions, fetchDocPostByField', error);
  }
  return post;
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

// EXPORTS

const actions = {};

actions.addDocOrder = addDocOrder;
// actions.addDocTxn = addDocTxn;
actions.fetchDocGift = fetchDocGift;
actions.fetchDocInfluencerByID = fetchDocInfluencerByID;
actions.fetchDocInfluencerByField = fetchDocInfluencerByField;
// actions.fetchDocOrder = fetchDocOrder;
actions.fetchDocsGiftOptions = fetchDocsGiftOptions;
actions.fetchDocsInfluencers = fetchDocsInfluencers;
// actions.fetchDocsOrders = fetchDocsOrders;
// actions.fetchDocsTxns = fetchDocsTxns;
actions.fetchOrderNum = fetchOrderNum;
// actions.updateDocOrder = updateDocOrder;

actions.fetchCollPosts = fetchCollPosts;
actions.fetchDocPostByField = fetchDocPostByField;

export default actions;
