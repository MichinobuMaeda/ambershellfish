import test from 'firebase-functions-test';
import firebase from './firebase';
import deployment from './deployment';

afterEach(async () => {
  await test().firestore.clearFirestoreData({ projectId: 'ambershellfish' });
});

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
    const db = firebase.firestore();
    const doc = await db.collection('service').doc('deployment').get();
    expect(doc.get('version')).toEqual(1);
  });

  it('set deployment version 1,'
    + ' if previous version is null', async () => {
    await deployment(
      firebase,
      test().firestore.makeDocumentSnapshot(
        { version: null },
        'service/deployment',
      ),
    );
    const db = firebase.firestore();
    const doc = await db.collection('service').doc('deployment').get();
    expect(doc.get('version')).toEqual(1);
  });

  it('set deployment version 1,'
    + ' if previous version is 0', async () => {
    await deployment(
      firebase,
      test().firestore.makeDocumentSnapshot(
        { version: 0 },
        'service/deployment',
      ),
    );
    const db = firebase.firestore();
    const doc = await db.collection('service').doc('deployment').get();
    expect(doc.get('version')).toEqual(1);
  });

  it('set deployment version 1,'
    + ' if previous version is 1', async () => {
    await deployment(
      firebase,
      test().firestore.makeDocumentSnapshot(
        { version: 1 },
        'service/deployment',
      ),
    );
    const db = firebase.firestore();
    const doc = await db.collection('service').doc('deployment').get();
    expect(doc.get('version')).toEqual(1);
  });

  it('set deployment version 2,'
    + ' if previous version is 2', async () => {
    await deployment(
      firebase,
      test().firestore.makeDocumentSnapshot(
        { version: 2 },
        'service/deployment',
      ),
    );
    const db = firebase.firestore();
    const doc = await db.collection('service').doc('deployment').get();
    expect(doc.get('version')).toEqual(2);
  });
});
