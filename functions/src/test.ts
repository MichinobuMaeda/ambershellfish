import { config, region, logger } from 'firebase-functions';

import firebase from './firebase';

export const setDataVersion = region(config().region)
  .https.onRequest(async (req, res): Promise<void> => {
    const version = Number(req.query.version || 0);
    const db = firebase.firestore();
    await db.collection('service').doc('deployment').set({
      version,
    });
    logger.info(`Set version: ${version}`);
    res.send(`Set version: ${version}\n`);
  });
