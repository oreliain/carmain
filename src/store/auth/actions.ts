import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';
import firebase from 'firebase/app';
import { firestoreAction } from 'vuexfire';
import { UserData } from '../../models/User';
import { Notify } from 'quasar';

const actions: ActionTree<AuthStateInterface, StateInterface> = {
  /**
   * @param {Object} $root - Place holder argument(Vuex store) to allow data to be passed
   *  as second argument.
   * @param email
   * @param password
   * @returns {function} - Firebase services function:
   * src/services/firebase/email.js > createUserWithEmail
   */
  async createNewUser(
    $root,
    { email, password }: { email: string; password: string }
  ): Promise<firebase.auth.UserCredential> {
    const userCredential = await this.$fb.createUserWithEmail(email, password);
    const userRef = this.$fb.docRef<UserData>('users', userCredential.user.uid);
    await this.$fb.addUserToUsersCollection({ email }, userRef);
    return userCredential;
  },

  /**
   * @param {Object} $root - Place holder argument(Vuex store) to allow data to be passed
   *  as second argument.
   * @param email
   * @param password
   * @returns {function} - Firebase services function:
   * src/services/firebase/email.js > loginWithEmail
   */
  loginUser(
    $root,
    { email, password }: { email: string; password: string }
  ): Promise<firebase.auth.UserCredential> {
    const $fb = this.$fb;
    return $fb.loginWithEmail(email, password);
  },

  /**
   * @returns {function} - Firebase services function:
   * src/services/firebase/email.js > logoutUser
   */
  async logoutUser() {
    try {
      firestoreAction(({ unbindFirestoreRef }) => {
        unbindFirestoreRef('currentUser');
      });
      await this.$fb.logoutUser();
    } catch (err) {
      Notify.create({
        type: 'webapp_error',
        message: `An error as occured [logoutUser]: ${(err as Error).message}`,
      });
    }
  },
};

export default actions;
