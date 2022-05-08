import { app } from 'firebase-admin';

type GurdedCallBack = (
  firebase: app.App,
  uid: string,
) => Promise<any>;

const isValidAccount = async (
  firebase: app.App,
  uid: string | undefined,
) => {
  if (!uid) throw Error(`uid: ${uid}`);

  const db = firebase.firestore();
  const account = await db.collection('accounts').doc(uid).get();

  if (account.exists !== true) {
    throw Error(`uid: ${uid}, exists: ${account.exists}`);
  }

  if (account.get('valid') !== true) {
    throw Error(`uid: ${uid}, valid: ${account.get('valid')}`);
  }

  if (account.get('deletedAt')) {
    throw Error(`uid: ${uid}, deletedAt: ${account.get('deletedAt')}`);
  }

  return account;
};

export const requireValidAccount = async (
  firebase: app.App,
  uid: string | undefined,
  cb: GurdedCallBack,
) => {
  await isValidAccount(firebase, uid);
  return cb(firebase, uid!);
};

export const requireAdminAccount = async (
  firebase: app.App,
  uid: string | undefined,
  cb: GurdedCallBack,
) => {
  const account = await isValidAccount(firebase, uid);

  if (account.get('admin') !== true) {
    throw Error(`uid: ${uid}, admin: ${account.get('admin')}`);
  }

  return cb(firebase, uid!);
};
