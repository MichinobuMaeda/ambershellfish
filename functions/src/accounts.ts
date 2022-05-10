import { Change } from 'firebase-functions';
import { app, firestore } from 'firebase-admin';

import { EMPTY_EMAIL } from './utils';

export const onCreateAccount = async (
  firebase: app.App,
  doc: firestore.DocumentSnapshot,
) => {
  const displayName = doc.get('name') || '';
  const email = doc.get('email') || null;

  const auth = firebase.auth();
  let user;

  if (email) {
    try {
      user = await auth.getUserByEmail(email);
      await auth.updateUser(user.uid, { displayName });
    } catch (e) {
      user = await auth.createUser({ uid: doc.id, displayName, email });
    }
  } else {
    user = await auth.createUser({ uid: doc.id, displayName });
  }

  await doc.ref.update({
    uid: user.uid,
    updatedAt: new Date(),
    updatedBy: doc.id,
  });
};

export const onUpdateAccount = async (
  firebase: app.App,
  change: Change<firestore.DocumentSnapshot>,
): Promise<void> => {
  const { after } = change;
  const uid = after.get('uid');

  if (uid) {
    const auth = firebase.auth();
    const user = await auth.getUser(uid);

    if ((user.email || EMPTY_EMAIL) !== (after.get('email') || EMPTY_EMAIL)) {
      await auth.updateUser(
        uid,
        {
          email: after.get('email') || EMPTY_EMAIL,
          emailVerified: false,
        },
      );
    }

    if ((user.displayName || '') !== (after.get('name') || '')) {
      await auth.updateUser(
        uid,
        { displayName: after.get('name') || '' },
      );
    }
  } else {
    await onCreateAccount(firebase, after);
  }
};

const hashInvitation = async (
  seed: string,
  code: string,
): Promise<string> => {
  const { createHash } = await import('node:crypto');
  const hash = createHash('sha256');
  hash.update(seed);
  hash.update(code);
  return hash.digest('hex');
};

export const invite = (
  { invitee }: { invitee: string },
) => async (
  firebase: app.App,
  uid: string,
): Promise<string> => {
  const db = firebase.firestore();
  const conf = await db.collection('service').doc('conf').get();
  const { randomBytes } = await import('node:crypto');
  const code = randomBytes(128).toString('hex');
  const ts = new Date();

  await db.collection('accounts').doc(invitee).update({
    invitation: await hashInvitation(conf.get('seed') ?? '', code),
    invitedBy: uid,
    invitedAt: ts,
    updatedBy: uid,
    updatedAt: ts,
  });

  return code;
};

export const getToken = async (
  firebase: app.App,
  { code }: { code: string },
): Promise<string> => {
  const db = firebase.firestore();
  const conf = await db.collection('service').doc('conf').get();
  const invitation = await hashInvitation(`${conf.get('seed')}`, code);
  const accounts = await db.collection('accounts')
    .where('invitation', '==', invitation).get();

  if (accounts.docs.length !== 1) {
    throw new Error('No record');
  }

  const account = accounts.docs[0];
  const resetRecord = {
    invitation: null,
    invitedBy: null,
    invitedAt: null,
    updatedBy: 'system',
    updatedAt: new Date(),
  };

  const empties = ['uid', 'invitedAt', 'invitedBy']
    .filter((key) => !account.get(key));

  if (empties.length) {
    await account.ref.update(resetRecord);
    throw new Error(`Invalid status: ${account.id} ${empties.join(', ')}`);
  }

  const expired = new Date().getTime() - conf.get('invExp');
  const invitedAt = (account.get('invitedAt') as firestore.Timestamp).toMillis();

  if (invitedAt < expired) {
    await account.ref.update(resetRecord);
    throw new Error(`Expired: ${account.id}`);
  }

  return firebase.auth().createCustomToken(account.get('uid'));
};
