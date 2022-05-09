import { config, region } from 'firebase-functions';
import firebase from './firebase';
import deploymentFunc from './deployment';
import { requireAdminAccount } from './guard';
import * as accounts from './accounts';

export const deployment = region(
  config().region,
).firestore.document(
  'service/deployment',
).onDelete(
  (snap) => deploymentFunc(firebase, snap),
);

export const createAccount = region(
  config().region,
).https.onCall(
  async (data, context) => requireAdminAccount(
    firebase,
    context.auth?.uid,
    accounts.createAccount(data),
  ),
);

export const updateEmail = region(
  config().region,
).https.onCall(
  async (data, context) => requireAdminAccount(
    firebase,
    context.auth?.uid,
    accounts.updateEmail(data),
  ),
);
