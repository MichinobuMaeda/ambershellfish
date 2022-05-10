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

export const onCreateAccount = region(
  config().region,
).firestore.document('accounts/{accountId}').onCreate(
  (doc) => accounts.onCreateAccount(firebase, doc),
);

export const onUpdateAccount = region(
  config().region,
).firestore.document('accounts/{accountId}').onUpdate(
  (chane) => accounts.onUpdateAccount(firebase, chane),
);

export const invite = region(
  config().region,
).https.onCall(
  (data, context) => requireAdminAccount(
    firebase,
    context.auth?.uid,
    accounts.invite(data),
  ),
);

export const getToken = region(
  config().region,
).https.onCall(
  (data) => accounts.getToken(firebase, data),
);
