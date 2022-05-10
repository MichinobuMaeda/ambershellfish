import { config, logger } from 'firebase-functions';
import { app, firestore } from 'firebase-admin';

const deployment = async (
  firebase: app.App,
  snap: firestore.QueryDocumentSnapshot,
): Promise<void> => {
  const deleted = snap.data();
  const current = deleted.version || 0;
  logger.info(`Get version: ${current}`);
  await snap.ref.set(deleted);

  const auth = firebase.auth();
  const db = firebase.firestore();

  const version = 1;
  if (current < version) {
    const ts = new Date();
    const docInfo = {
      createdAt: ts,
      createdBy: 'system',
      updatedAt: ts,
      updatedBy: 'system',
    };

    const { randomBytes } = await import('node:crypto');

    const batch = db.batch();
    batch.set(
      db.collection('service').doc('conf'),
      {
        ...docInfo,
        version: '1.0.0+0',
        url: config().initial.url,
        seed: randomBytes(128).toString('hex'),
        invExp: 10 * 24 * 3600 * 1000,
      },
    );

    const user = await auth.createUser({
      displayName: 'Primary user',
      email: config().initial.email,
      emailVerified: true,
      password: config().initial.password,
    });

    await db.collection('accounts').add({
      ...docInfo,
      name: user.displayName,
      email: user.email,
      valid: true,
      admin: true,
      tester: true,
    });

    batch.set(snap.ref, { version, updatedAt: new Date() });
    await batch.commit();
    logger.info(`Set version: ${version}`);
  }
};

export default deployment;
