import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { AuthStateInterface } from './state';

const actions: ActionTree<AuthStateInterface, StateInterface> = {
  /**
   * @param {Object} $root - Place holder argument(Vuex store) to allow data to be passed
   *  as second argument.
   * @param email
   * @param password
   * @returns {function} - Firebase services function:
   * src/services/firebase/email.js > createUserWithEmail
   */
  createNewUser($root, { email, password }: { email: string; password: string }) {
    const $fb = this.$fb;
    return $fb.createUserWithEmail(email, password);
  },

  /**
   * @param {Object} $root - Place holder argument(Vuex store) to allow data to be passed
   *  as second argument.
   * @param email
   * @param password
   * @returns {function} - Firebase services function:
   * src/services/firebase/email.js > loginWithEmail
   */
  loginUser($root, { email, password }: { email: string; password: string }) {
    const $fb = this.$fb;
    return $fb.loginWithEmail(email, password);
  },

  /**
   * @returns {function} - Firebase services function:
   * src/services/firebase/email.js > logoutUser
   */
  async logoutUser() {
    const $fb = this.$fb;
    await $fb.logoutUser();
  },
};

export default actions;
