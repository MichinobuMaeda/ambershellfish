import { config, region, logger } from 'firebase-functions';

import firebase from './firebase';

export const setDataVersion = region(
  config().region,
).https.onRequest(
  async (req, res): Promise<void> => {
    const version = Number(req.query.version || 0);
    const db = firebase.firestore();
    await db.collection('service').doc('deployment').set({
      version,
    });
    logger.info(`Set version: ${version}`);
    res.send(`Set version: ${version}\n`);
  },
);

export const clearAll = async () => {
  const auth = firebase.auth();
  const userList = await auth.listUsers();
  if (userList.users) {
    await auth.deleteUsers(
      userList.users.map((user) => user.uid),
    );
  }

  const db = firebase.firestore();
  const batch = db.batch();
  const cols = await db.listCollections();
  await Promise.all(
    cols.map(
      (col) => col.get().then(
        (snap) => snap.forEach(
          (doc) => batch.delete(doc.ref),
        ),
      ),
    ),
  );
  batch.commit();
};
