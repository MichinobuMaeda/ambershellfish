import { logger } from 'firebase-functions';
import { app, firestore } from 'firebase-admin';

const deployment = async (
  firebase: app.App,
  snap: firestore.QueryDocumentSnapshot,
): Promise<void> => {
  const current = snap.get('version') || 0;
  logger.info(`Get version: ${current}`);
  await snap.ref.set({ version: current });
  logger.info(`Restore version: ${current}`);

  const db = firebase.firestore();

  const version = 1;
  if (current < version) {
    const batch = db.batch();
    batch.set(snap.ref, { version });
    await batch.commit();
    logger.info(`Set version: ${version}`);
  }
};

export default deployment;
