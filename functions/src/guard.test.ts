import { app } from 'firebase-admin';
import firebase from './firebase';
import { clearAll } from './test';
import {
  requireValidAccount,
  requireAdminAccount,
} from './guard';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockCb = jest.fn(async (a: app.App, b: string) => 'c');

afterEach(async () => {
  jest.clearAllMocks();
  await clearAll();
});

describe('requireValidAccount', () => {
  it('throw error,'
    + ' if uid is undefined', async () => {
    expect(
      () => requireValidAccount(firebase, undefined, mockCb),
    ).rejects.toThrow('uid: undefined');
  });

  it('throw error,'
    + ' if uid has no corresponding doc.', async () => {
    expect(
      () => requireValidAccount(firebase, 'user01', mockCb),
    ).rejects.toThrow('uid: user01, exists: false');
  });

  it('throw error,'
    + ' if the account is invalid.', async () => {
    const db = firebase.firestore();
    await db.collection('accounts').doc('user01').set({
      name: 'invalid user',
      valid: false,
    });
    await expect(
      () => requireValidAccount(firebase, 'user01', mockCb),
    ).rejects.toThrow('uid: user01, valid: false');
  });

  it('throw error,'
    + ' if the account is deleted.', async () => {
    const db = firebase.firestore();
    await db.collection('accounts').doc('user01').set({
      name: 'deleted user',
      valid: true,
      deletedAt: new Date(),
    });
    await expect(
      () => requireValidAccount(firebase, 'user01', mockCb),
    ).rejects.toThrow(expect.objectContaining({
      message: expect.stringContaining('uid: user01, deletedAt:'),
    }));
  });

  it('call cb() for valid user.', async () => {
    const db = firebase.firestore();
    await db.collection('accounts').doc('user01').set({
      name: 'valid user',
      valid: true,
    });
    const ret = await requireValidAccount(firebase, 'user01', mockCb);
    expect(mockCb.mock.calls).toEqual([[firebase, 'user01']]);
    expect(ret).toEqual('c');
  });

  it('call cb() for admin user.', async () => {
    const db = firebase.firestore();
    await db.collection('accounts').doc('user01').set({
      name: 'valid user',
      valid: true,
      admin: true,
    });
    const ret = await requireValidAccount(firebase, 'user01', mockCb);
    expect(mockCb.mock.calls).toEqual([[firebase, 'user01']]);
    expect(ret).toEqual('c');
  });
});

describe('requireAdminAccount', () => {
  it('throw error,'
    + ' if uid is undefined', async () => {
    await expect(
      () => requireAdminAccount(firebase, undefined, mockCb),
    ).rejects.toThrow('uid: undefined');
  });

  it('throw error,'
    + ' if uid has no corresponding doc.', async () => {
    await expect(
      () => requireAdminAccount(firebase, 'user01', mockCb),
    ).rejects.toThrow('uid: user01, exists: false');
  });

  it('throw error,'
    + ' if the account is invalid.', async () => {
    const db = firebase.firestore();
    await db.collection('accounts').doc('user01').set({
      name: 'invalid user',
      valid: false,
    });
    await expect(
      () => requireAdminAccount(firebase, 'user01', mockCb),
    ).rejects.toThrow('uid: user01, valid: false');
  });

  it('throw error,'
    + ' if the account is deleted.', async () => {
    const db = firebase.firestore();
    await db.collection('accounts').doc('user01').set({
      name: 'deleted user',
      valid: true,
      deletedAt: new Date(),
    });
    await expect(
      () => requireAdminAccount(firebase, 'user01', mockCb),
    ).rejects.toThrow(expect.objectContaining({
      message: expect.stringContaining('uid: user01, deletedAt:'),
    }));
  });

  it('throw error,'
    + ' if the account is not admin.', async () => {
    const db = firebase.firestore();
    await db.collection('accounts').doc('user01').set({
      name: 'valid user',
      valid: true,
      admin: false,
    });
    await expect(
      () => requireAdminAccount(firebase, 'user01', mockCb),
    ).rejects.toThrow('uid: user01, admin: false');
  });

  it('call cb() for valid admin user.', async () => {
    const db = firebase.firestore();
    await db.collection('accounts').doc('user01').set({
      name: 'admin user',
      valid: true,
      admin: true,
    });
    const ret = await requireAdminAccount(firebase, 'user01', mockCb);
    expect(mockCb.mock.calls).toEqual([[firebase, 'user01']]);
    expect(ret).toEqual('c');
  });
});
