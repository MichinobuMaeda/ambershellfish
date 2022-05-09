import test from 'firebase-functions-test';
import firebase from './firebase';
import { clearAll } from './test';
import deployment from './deployment';

afterEach(async () => {
  jest.clearAllMocks();
  await clearAll();
});

const primaryAccount = {
  email: 'primary@example.com',
  valid: true,
  admin: true,
  tester: true,
  createdBy: 'system',
  updatedBy: 'system',
};

const initialConf = {
  version: '1.0.0+0',
  url: 'http://localhost:5000/',
  createdBy: 'system',
  updatedBy: 'system',
};

describe('deployment', () => {
  it('set deployment version 1,'
    + ' if previous version is undefined', async () => {
    await deployment(
      firebase,
      test().firestore.makeDocumentSnapshot(
        {},
        'service/deployment',
      ),
    );

    const auth = firebase.auth();
    const db = firebase.firestore();

    const userList = await auth.listUsers();
    expect(userList.users).toHaveLength(1);
    expect(userList.users[0].email).toEqual('primary@example.com');

    const accounts = await db.collection('accounts').get();
    expect(accounts.docs).toHaveLength(1);
    expect(accounts.docs[0].data()).toMatchObject(primaryAccount);

    const conf = await db.collection('service').doc('conf').get();
    expect(conf.data()).toMatchObject(initialConf);

    const doc = await db.collection('service').doc('deployment').get();
    expect(doc.get('version')).toEqual(1);
  });

  it('set deployment version 1,'
    + ' if previous version is null', async () => {
    await deployment(
      firebase,
      test().firestore.makeDocumentSnapshot(
        { version: null, updatedAt: new Date() },
        'service/deployment',
      ),
    );

    const auth = firebase.auth();
    const db = firebase.firestore();

    const userList = await auth.listUsers();
    expect(userList.users).toHaveLength(1);
    expect(userList.users[0].email).toEqual('primary@example.com');

    const accounts = await db.collection('accounts').get();
    expect(accounts.docs).toHaveLength(1);
    expect(accounts.docs[0].data()).toMatchObject(primaryAccount);

    const conf = await db.collection('service').doc('conf').get();
    expect(conf.data()).toMatchObject(initialConf);

    const doc = await db.collection('service').doc('deployment').get();
    expect(doc.get('version')).toEqual(1);
  });

  it('set deployment version 1,'
    + ' if previous version is 0', async () => {
    await deployment(
      firebase,
      test().firestore.makeDocumentSnapshot(
        { version: 0, updatedAt: new Date() },
        'service/deployment',
      ),
    );

    const auth = firebase.auth();
    const db = firebase.firestore();

    const userList = await auth.listUsers();
    expect(userList.users).toHaveLength(1);
    expect(userList.users[0].email).toEqual('primary@example.com');

    const accounts = await db.collection('accounts').get();
    expect(accounts.docs).toHaveLength(1);
    expect(accounts.docs[0].data()).toMatchObject(primaryAccount);
    await accounts.docs[0].ref.delete();

    const conf = await db.collection('service').doc('conf').get();
    expect(conf.data()).toMatchObject(initialConf);
    expect(conf.get('seed')).toHaveLength(256);

    const doc = await db.collection('service').doc('deployment').get();
    expect(doc.get('version')).toEqual(1);
  });

  it('set deployment version 1,'
    + ' if previous version is 1', async () => {
    await deployment(
      firebase,
      test().firestore.makeDocumentSnapshot(
        { version: 1, updatedAt: new Date() },
        'service/deployment',
      ),
    );

    const auth = firebase.auth();
    const db = firebase.firestore();

    const userList = await auth.listUsers();
    expect(userList.users).toHaveLength(0);

    const accounts = await db.collection('accounts').get();
    expect(accounts.docs).toHaveLength(0);

    const conf = await db.collection('service').doc('conf').get();
    expect(conf.exists).toBeFalsy();

    const doc = await db.collection('service').doc('deployment').get();
    expect(doc.get('version')).toEqual(1);
  });

  it('set deployment version 2,'
    + ' if previous version is 2', async () => {
    await deployment(
      firebase,
      test().firestore.makeDocumentSnapshot(
        { version: 2, updatedAt: new Date() },
        'service/deployment',
      ),
    );

    const auth = firebase.auth();
    const db = firebase.firestore();

    const userList = await auth.listUsers();
    expect(userList.users).toHaveLength(0);

    const accounts = await db.collection('accounts').get();
    expect(accounts.docs).toHaveLength(0);

    const conf = await db.collection('service').doc('conf').get();
    expect(conf.exists).toBeFalsy();

    const doc = await db.collection('service').doc('deployment').get();
    expect(doc.get('version')).toEqual(2);
  });
});
