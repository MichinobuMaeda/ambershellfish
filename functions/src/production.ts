import { config, region } from 'firebase-functions';
import firebase from './firebase';
import deploymentFunc from './deployment';

export const deployment = region(config().region)
  .firestore.document('service/deployment')
  .onDelete((snap) => deploymentFunc(firebase, snap));
