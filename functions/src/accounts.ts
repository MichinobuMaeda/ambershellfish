import { logger } from 'firebase-functions';
import { app } from 'firebase-admin';

const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const createAccount = (
  {
    name,
    email = undefined,
    admin = false,
    tester = false,
  }: {
    name: string,
    email: string | undefined,
    admin: boolean,
    tester: boolean,
  },
) => async (
  firebase: app.App,
  uid: string,
) => {
  if (typeof name !== 'string' || !name.trim()) throw Error(`name: ${name}`);

  const auth = firebase.auth();
  const db = firebase.firestore();
  const ts = new Date();

  if (typeof email === 'string') {
    if (!regexEmail.test(email)) throw Error(`email: ${email}`);

    const accounts = await db.collection('accounts').where('email', '==', email).get();
    if (accounts.size) throw Error(`email: ${email}`);
  }

  logger.info(`name: ${name}, email: ${email}, admin: ${admin}, tester: ${tester}`);

  const { id } = await db.collection('accounts').add({
    name: name.trim(),
    email,
    valid: true,
    admin,
    tester,
    createdAt: ts,
    createdBy: uid,
    updatedAt: ts,
    updatedBy: uid,
  });

  await auth.createUser({
    uid: id,
    email,
    emailVerified: false,
  });

  return { id };
};

export const updateEmail = (
  {
    id,
    email,
  }: {
    id: string,
    email: string,
  },
) => async (
  firebase: app.App,
  uid: string,
) => {
  if (!regexEmail.test(email)) throw Error(`email: ${email}`);

  const auth = firebase.auth();
  const db = firebase.firestore();
  const ts = new Date();

  const accounts = await db.collection('accounts').where('email', '==', email).get();
  if (accounts.size) throw Error(`email: ${email}`);

  logger.info(`id: ${id}, email: ${email}`);

  await db.collection('accounts').doc(id).update({
    email,
    updatedAt: ts,
    updatedBy: uid,
  });

  await auth.updateUser(
    id,
    {
      email,
      emailVerified: false,
    },
  );

  return { id };
};
