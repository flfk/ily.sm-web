import { db } from './firebase';
// import { storage } from './firebase';

// Collection and document Names
const COLL_TXNS = 'txns';

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

// EXPORTS

const actions = {};

actions.fetchDocsTxns = fetchDocsTxns;

export default actions;
