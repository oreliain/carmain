import { firestoreAction } from 'vuexfire';
import { ActionTree } from 'vuex';
import { docRef } from '../../services/firebase/db';
import { StateInterface } from '../index';
import { UserStateInterface } from './state';
import User, { UserData } from '../../models/User';

const actions: ActionTree<UserStateInterface, StateInterface> = {
  getCurrentUser: firestoreAction(({ bindFirestoreRef }, id) => {
    return bindFirestoreRef('currentUser', docRef('users', id));
  }),

  updateUserData($root, data: Partial<UserData>) {
    const updatedUser = new User(data);
    return docRef<UserData>('users', data.id).update(updatedUser.toJSON());
  },
};

export default actions;
