import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import User, { UserData } from 'src/models/User';

export function firestore(): firebase.firestore.Firestore {
  return firebase.firestore();
}

export function docRef<
  DocumentData extends firebase.firestore.DocumentData = firebase.firestore.DocumentData
>(
  collectionName: string,
  id: string
): firebase.firestore.DocumentReference<DocumentData> {
  return firestore()
    .collection(collectionName)
    .doc(id) as firebase.firestore.DocumentReference<DocumentData>;
}

export function storageRef(
  storageLocation: string
): firebase.storage.Reference {
  return firebase.storage().ref(storageLocation);
}

export function addUserToUsersCollection(
  state: Partial<User>,
  userRef: firebase.firestore.DocumentReference<Partial<UserData>>
): Promise<void> {
  const { email } = state;
  const user = new User({ email });
  return userRef.set(user.toJSON());
}
