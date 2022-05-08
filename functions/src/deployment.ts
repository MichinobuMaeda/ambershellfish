import { config, logger } from 'firebase-functions';
import { app, firestore } from 'firebase-admin';

import { createAccount } from './accounts';

const deployment = async (
  firebase: app.App,
  snap: firestore.QueryDocumentSnapshot,
): Promise<void> => {
  const current = snap.get('version') || 0;
  logger.info(`Get version: ${current}`);
  await snap.ref.set({ version: current });
  logger.info(`Restore version: ${current}`);

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

    const { id } = await createAccount({
      name: 'Primary user',
      email: config().initial.email,
      admin: true,
      tester: true,
    })(firebase, 'system');

    await auth.updateUser(
      id,
      {
        password: config().initial.password,
        emailVerified: true,
      },
    );

    const batch = db.batch();
    batch.set(
      db.collection('service').doc('conf'),
      {
        ...docInfo,
        version: '1.0.0+0',
        url: config().initial.url,
      },
    );

    batch.set(snap.ref, { version });
    await batch.commit();
    logger.info(`Set version: ${version}`);
  }
};

export default deployment;
