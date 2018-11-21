import { db } from './firebase';
// import { storage } from './firebase';

// Collection and document Names
const COLL_GIFT_OPTIONS = 'giftOptions';
const COLL_INFLUENCERS = 'influencers';
const COLL_ORDERS = 'orders';
const COLL_TXNS = 'txns';
const COLL_UTILS = 'utils';

const DOC_LAST_ORDER = 'lastOrder';

const addDocOrder = async order => {
  const newOrder = await db.collection(COLL_ORDERS).add(order);
  return newOrder;
};

const addDocTxn = async txn => {
  const newTxn = await db.collection(COLL_TXNS).add(txn);
  return newTxn;
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

const fetchDocInfluencerByUsername = async username => {
  let influencer = {};
  try {
    const influencerRef = db.collection(COLL_INFLUENCERS);
    const snapshot = await influencerRef
      .where('username', '==', username)
      .limit(1)
      .get();
    snapshot.forEach(doc => {
      influencer = doc.data();
      const { id } = doc;
      influencer.id = id;
    });
  } catch (error) {
    console.error('Error actions, fetchDocInfluencerByUsername', error);
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

const fetchDocsTxns = async influencerID => {
  const txns = [];
  try {
    const txnsRef = db.collection(COLL_TXNS);
    const snapshot = await txnsRef.where('influencerID', '==', influencerID).get();
    snapshot.forEach(doc => {
      const txn = doc.data();
      const { id } = doc;
      txn.id = id;
      txns.push(txn);
    });
  } catch (error) {
    console.error('Error actions, fetchDocsTxns', error);
  }
  return txns;
};

const fetchOrderNum = async () => {
  const lastOrderRef = db.collection(COLL_UTILS).doc(DOC_LAST_ORDER);
  const snapshot = await lastOrderRef.get();
  const data = await snapshot.data();
  const newOrderNum = data.orderNum + 1;
  await lastOrderRef.set({ orderNum: newOrderNum });
  return data.orderNum + 1;
};

// EXPORTS

const actions = {};

actions.addDocOrder = addDocOrder;
actions.addDocTxn = addDocTxn;
actions.fetchDocsTxns = fetchDocsTxns;
actions.fetchDocGift = fetchDocGift;
actions.fetchDocInfluencerByID = fetchDocInfluencerByID;
actions.fetchDocInfluencerByUsername = fetchDocInfluencerByUsername;
actions.fetchDocOrder = fetchDocOrder;
actions.fetchDocsGiftOptions = fetchDocsGiftOptions;

actions.fetchOrderNum = fetchOrderNum;

export default actions;
