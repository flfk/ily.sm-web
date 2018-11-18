// import { db } from './firebase';
import { storage } from './firebase';

// Collection and document Names

const STORAGE_MERCH_BASE_PATH = 'gs://online-meet-and-greets.appspot.com/merch/';
const STORAGE_MERCH_EXTENSION = '.png/';

const STORAGE_DASHBOARD_TEASER_PATH = 'gs://online-meet-and-greets.appspot.com/dashboardTeasers/';
const STORAGE_DASHBOARD_TEASER_EXTENSION = '.png/';

// LEADERBOARD RELATED

const fetchDashboardTeaserImgURL = async username => {
  let downloadURL = null;
  try {
    const refPath = STORAGE_DASHBOARD_TEASER_PATH + username + STORAGE_DASHBOARD_TEASER_EXTENSION;
    downloadURL = await storage.refFromURL(refPath).getDownloadURL();
  } catch (error) {
    console.error('Actions, fetchMerchImgUrl', error);
  }
  return downloadURL;
};

const fetchMerchImgUrl = async merchID => {
  let downloadURL = null;
  try {
    const refPath = STORAGE_MERCH_BASE_PATH + merchID + STORAGE_MERCH_EXTENSION;
    downloadURL = await storage.refFromURL(refPath).getDownloadURL();
  } catch (error) {
    console.error('Actions, fetchMerchImgUrl', error);
  }
  return downloadURL;
};

// EXPORTS

const actions = {};

actions.fetchDashboardTeaserImgURL = fetchDashboardTeaserImgURL;
actions.fetchMerchImgUrl = fetchMerchImgUrl;

export default actions;
