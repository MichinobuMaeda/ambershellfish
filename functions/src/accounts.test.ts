import test from 'firebase-functions-test';
import { Change } from 'firebase-functions';
import { firestore } from 'firebase-admin';

import { EMPTY_EMAIL } from './utils';
import firebase from './firebase';
import { clearAll } from './test';
import {
  onCreateAccount,
  onUpdateAccount,
  invite,
  getToken,
} from './accounts';

afterEach(async () => {
  jest.clearAllMocks();
  await clearAll();
});

describe('onCreateAccount', () => {
  it('connects auth user with same email and set display name.', async () => {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const name = 'User 02';
    const email = 'user02@example.com';
    const { uid } = await auth.createUser({ email });
    const doc = await db.collection('accounts').add({ name, email });

    await onCreateAccount(firebase, await doc.get());

    const user = await auth.getUser(uid);
    expect(user.displayName).toEqual(name);

    const account = await doc.get();
    expect(account.get('uid')).toEqual(uid);
  });

  it('creates auth user with email.', async () => {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const name = 'User 02';
    const email = 'user02@example.com';
    const doc = await db.collection('accounts').add({ name, email });

    await onCreateAccount(firebase, await doc.get());

    const account = await doc.get();
    expect(account.get('uid')).toBeDefined();

    const user = await auth.getUser(account.get('uid'));
    expect(user.displayName).toEqual(name);
    expect(user.email).toEqual(email);
  });

  it('creates auth user without email.', async () => {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const name = '';
    const doc = await db.collection('accounts').add({ name });

    await onCreateAccount(firebase, await doc.get());

    const account = await doc.get();
    expect(account.get('uid')).toBeDefined();

    const user = await auth.getUser(account.get('uid'));
    expect(user.displayName).toEqual(name);
    expect(user.email).not.toBeDefined();
  });
});

describe('onUpdateAccount', () => {
  it('creates auth user for empty uid.', async () => {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const name = 'User 02';
    const email = 'user02@example.com';
    const doc = await db.collection('accounts').add({ name, email });

    await onUpdateAccount(firebase, {
      before: test().firestore.makeDocumentSnapshot({ name }, doc.path),
      after: await doc.get(),
    } as Change<firestore.DocumentSnapshot>);

    const account = await doc.get();
    expect(account.get('uid')).toBeDefined();

    const user = await auth.getUser(account.get('uid'));
    expect(user.displayName).toEqual(name);
    expect(user.email).toEqual(email);
  });

  it('sets name of auth user.', async () => {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const name = '';
    const email = 'user02@example.com';
    const { uid } = await auth.createUser({ displayName: 'Test' });
    const doc = await db.collection('accounts').add({ uid, name, email });

    await onUpdateAccount(firebase, {
      before: test().firestore.makeDocumentSnapshot({ uid, name }, doc.path),
      after: await doc.get(),
    } as Change<firestore.DocumentSnapshot>);

    const user = await auth.getUser(uid);
    expect(user.displayName).toEqual(name);
    expect(user.email).toEqual(email);
  });

  it('resets name of auth user for empty name.', async () => {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const name = 'User 02';
    const email = 'user02@example.com';
    const { uid } = await auth.createUser({ displayName: 'Test', email });
    const doc = await db.collection('accounts').add({ uid, name: '', email });

    await onUpdateAccount(firebase, {
      before: test().firestore.makeDocumentSnapshot({ uid, name, email }, doc.path),
      after: await doc.get(),
    } as Change<firestore.DocumentSnapshot>);

    const user = await auth.getUser(uid);
    expect(user.displayName).toEqual('');
    expect(user.email).toEqual(email);
  });

  it('sets email of auth user.', async () => {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const name = 'User 02';
    const email = 'user02@example.com';
    const { uid } = await auth.createUser({ displayName: name });
    const doc = await db.collection('accounts').add({ uid, name, email });

    await onUpdateAccount(firebase, {
      before: test().firestore.makeDocumentSnapshot({ uid, name }, doc.path),
      after: await doc.get(),
    } as Change<firestore.DocumentSnapshot>);

    const user = await auth.getUser(uid);
    expect(user.displayName).toEqual(name);
    expect(user.email).toEqual(email);
  });

  it('resets email of auth user for empty email.', async () => {
    const auth = firebase.auth();
    const db = firebase.firestore();
    const name = 'User 02';
    const email = 'user02@example.com';
    const { uid } = await auth.createUser({ displayName: '', email });
    const doc = await db.collection('accounts').add({ uid, name, email: '' });

    await onUpdateAccount(firebase, {
      before: test().firestore.makeDocumentSnapshot({ uid, name, email }, doc.path),
      after: await doc.get(),
    } as Change<firestore.DocumentSnapshot>);

    const user = await auth.getUser(uid);
    expect(user.displayName).toEqual(name);
    expect(user.email).toEqual(EMPTY_EMAIL);
  });
});

describe('invite', () => {
  it('sets invitation.', async () => {
    const db = firebase.firestore();
    const name = 'User 02';
    const invitedBy = 'user01';
    const doc = await db.collection('accounts').add({ name });

    await invite({ invitee: doc.id })(firebase, invitedBy);

    const account = await doc.get();
    expect(account.get('invitation')).toBeDefined();
    expect(account.get('invitedBy')).toEqual(invitedBy);
    expect(account.get('invitedAt')).toBeDefined();
  });
});

describe('getToken', () => {
  it('rejects account without invitation.', async () => {
    const db = firebase.firestore();
    const seed = 'test';
    const invExp = 1000000;
    await db.collection('service').doc('conf').set({ seed, invExp });
    const name = 'User 02';
    const doc = await db.collection('accounts').add({ name });
    const code = 'dummy';

    await expect(
      () => getToken(firebase, { code }),
    ).rejects.toThrow('No record');

    const account = await doc.get();
    expect(account.get('invitation')).toBeFalsy();
    expect(account.get('invitedBy')).toBeFalsy();
    expect(account.get('invitedAt')).toBeFalsy();
  });

  it('rejects account without uid.', async () => {
    const db = firebase.firestore();
    const seed = 'test';
    const invExp = 1000000;
    await db.collection('service').doc('conf').set({ seed, invExp });
    const name = 'User 02';
    const invitedBy = 'user01';
    const doc = await db.collection('accounts').add({ name });
    const code = await invite({ invitee: doc.id })(firebase, invitedBy);

    await expect(
      () => getToken(firebase, { code }),
    ).rejects.toThrow(`Invalid status: ${doc.id} uid`);

    const account = await doc.get();
    expect(account.get('invitation')).toBeFalsy();
    expect(account.get('invitedBy')).toBeFalsy();
    expect(account.get('invitedAt')).toBeFalsy();
  });

  it('rejects account without invitation records.', async () => {
    const db = firebase.firestore();
    const seed = 'test';
    const invExp = 1000000;
    await db.collection('service').doc('conf').set({ seed, invExp });
    const uid = 'user02';
    const name = 'User 02';
    const invitedBy = 'user01';
    const doc = await db.collection('accounts').add({ uid, name });
    const code = await invite({ invitee: doc.id })(firebase, invitedBy);
    await doc.update({
      invitedAt: null,
      invitedBy: null,
    });

    await expect(
      () => getToken(firebase, { code }),
    ).rejects.toThrow(`Invalid status: ${doc.id} invitedAt, invitedBy`);

    const account = await doc.get();
    expect(account.get('invitation')).toBeFalsy();
    expect(account.get('invitedBy')).toBeFalsy();
    expect(account.get('invitedAt')).toBeFalsy();
  });

  it('rejects expired invitation.', async () => {
    const db = firebase.firestore();
    const seed = 'test';
    const invExp = 1000000;
    await db.collection('service').doc('conf').set({ seed, invExp });
    const uid = 'user02';
    const name = 'User 02';
    const invitedBy = 'user01';
    const doc = await db.collection('accounts').add({ uid, name });
    const code = await invite({ invitee: doc.id })(firebase, invitedBy);
    await doc.update({
      invitedAt: new Date(new Date().getTime() - invExp - 1),
    });

    await expect(
      () => getToken(firebase, { code }),
    ).rejects.toThrow(`Expired: ${doc.id}`);

    const account = await doc.get();
    expect(account.get('invitation')).toBeFalsy();
    expect(account.get('invitedBy')).toBeFalsy();
    expect(account.get('invitedAt')).toBeFalsy();
  });

  it('gets invitation token.', async () => {
    const db = firebase.firestore();
    const seed = 'test';
    const invExp = 1000000;
    await db.collection('service').doc('conf').set({ seed, invExp });
    const uid = 'user02';
    const name = 'User 02';
    const invitedBy = 'user01';
    const doc = await db.collection('accounts').add({ uid, name });
    const code = await invite({ invitee: doc.id })(firebase, invitedBy);

    const token = await getToken(firebase, { code });

    expect(token).toBeDefined();

    const account = await doc.get();
    expect(account.get('invitation')).toBeDefined();
    expect(account.get('invitedBy')).toBeDefined();
    expect(account.get('invitedAt')).toBeDefined();
  });
});
