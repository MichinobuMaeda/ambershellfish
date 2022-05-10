import { config, region } from 'firebase-functions';
import { firestore } from 'firebase-admin';

import firebase from './firebase';
import deployment from './deployment';

export const setTestData = region(
  config().region,
).https.onRequest(
  async (req, res): Promise<void> => {
    const db = firebase.firestore();
    const ref = db.collection('service').doc('deployment');
    await ref.set({
      version: 0,
      updatedAt: new Date(),
    });

    await deployment(firebase, await ref.get() as firestore.QueryDocumentSnapshot);
    res.send('OK\n');
  },
);

export const clearAll = async () => {
  const auth = firebase.auth();
  const userList = await auth.listUsers();
  await Promise.all(
    (userList.users || []).map(
      (user) => auth.deleteUser(user.uid),
    ),
  );

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
  await batch.commit();
};
