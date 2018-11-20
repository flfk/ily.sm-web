import { db } from './firebase';
// import { storage } from './firebase';

// Collection and document Names
const COLL_TXNS = 'txns';
const COLL_GIFT_OPTIONS = 'giftOptions';

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
    console.error('Error actions, fetchDocsTxns', error);
  }
  return giftOptions;
};

// EXPORTS

const actions = {};

actions.fetchDocsTxns = fetchDocsTxns;
actions.fetchDocsGiftOptions = fetchDocsGiftOptions;

export default actions;
