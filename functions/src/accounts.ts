import { logger } from 'firebase-functions';
import { app } from 'firebase-admin';

const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const createAccount = (
  {
    name,
    email,
    admin,
    tester,
  }: {
    name?: string | null | undefined,
    email?: string | null | undefined,
    admin?: boolean | null | undefined,
    tester?: boolean | null | undefined,
  },
) => async (
  firebase: app.App,
  uid: string,
) => {
  if (typeof name !== 'string' || !name.trim()) {
    throw Error(`name: ${name}`);
  }

  const auth = firebase.auth();
  const db = firebase.firestore();
  const ts = new Date();

  if (typeof email === 'string' && email.trim()) {
    if (!regexEmail.test(email)) {
      throw Error(`email: ${email}`);
    }

    const accounts = await db.collection('accounts')
      .where('email', '==', email).get();

    if (accounts.size) {
      throw Error(`email: ${email}`);
    }
  }

  logger.info(`name: ${name}, email: ${email}, admin: ${admin}, tester: ${tester}`);

  const docInfo = {
    createdAt: ts,
    createdBy: uid,
    updatedAt: ts,
    updatedBy: uid,
  };

  const { id } = await db.collection('accounts').add(
    typeof email === 'string' && email.trim()
      ? {
        ...docInfo,
        name: name.trim(),
        email,
        valid: true,
        admin: admin === true,
        tester: tester === true,
      }
      : {
        ...docInfo,
        name: name.trim(),
        valid: true,
        admin: admin === true,
        tester: tester === true,
      },
  );

  await auth.createUser(
    typeof email === 'string'
      ? {
        uid: id,
        email,
        emailVerified: false,
      }
      : {
        uid: id,
        emailVerified: false,
      },
  );

  return { id };
};

export const updateEmail = (
  {
    id,
    email,
  }: {
    id?: string | null | undefined,
    email?: string | null | undefined,
  },
) => async (
  firebase: app.App,
  uid: string,
) => {
  if (typeof id !== 'string' || !id.trim()) {
    throw Error(`id: ${id}`);
  }

  if (typeof email !== 'string' || !regexEmail.test(email)) {
    throw Error(`email: ${email}`);
  }

  const auth = firebase.auth();
  const db = firebase.firestore();
  const ts = new Date();

  const ref = db.collection('accounts').doc(id);
  const doc = await ref.get();

  if (!doc.exists) {
    throw Error(`exists: ${doc.exists}, id: ${id}`);
  }

  const accounts = (await db.collection('accounts')
    .where('email', '==', email).get()).docs
    .filter((item) => item.id !== id);

  if (accounts.length) {
    throw Error(`email: ${email} is used`);
  }

  logger.info(`id: ${id}, email: ${email}`);

  await auth.updateUser(
    id,
    {
      email,
      emailVerified: false,
    },
  );

  await db.collection('accounts').doc(id).update({
    email,
    updatedAt: ts,
    updatedBy: uid,
  });

  return { id };
};
