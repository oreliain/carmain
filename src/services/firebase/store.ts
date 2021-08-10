import firebase from 'firebase/app';
import { Store } from 'vuex';
import { Router } from 'vue-router';
import { StateInterface } from 'src/store';

/**
 * Handle the auth state of the user and set it in the auth store module.
 * Also sets up redirection if the user loses authentication. The action
 * method will determine where the application routes to.
 * @param  {Object} store - Vuex Store
 * @param {Object} router
 * @param  {Object} currentUser - Firebase currentUser
 */
export async function handleOnAuthStateChanged(
  store: Store<StateInterface>,
  router: Router,
  currentUser: firebase.User | null
) {
  const initialAuthState = isAuthenticated(store);
  // Save to the store
  store.commit('auth/setAuthState', {
    isAuthenticated: currentUser !== null,
    isReady: true,
    uid: currentUser ? currentUser.uid : ''
  });

  // Get & bind the current user
  if (store.state.auth.isAuthenticated) {
    await store.dispatch('user/getCurrentUser', currentUser.uid)
  }

  // If the user loses authentication route
  // them to the login page
  if (!currentUser && initialAuthState) {
    await router.push({
      path: '/auth/login',
    });
  }
}

/**
 * @param  {Object} store - Vuex store
 * @return {Boolean} - isAuthenticated
 */
export function isAuthenticated(store: Store<StateInterface>) {
  return store.state.auth.isAuthenticated;
}

/**
 * Async function providing the application time to
 * wait for firebase to initialize and determine if a
 * user is authenticated or not with only a single observable.
 * https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onauthstatechanged
 * @param {Object} store - Vuex store
 * @returns {Promise} - A promise that return firebase.Unsubscribe
 */
export async function ensureAuthIsInitialized(store: Store<StateInterface>) {
  if (store.state.auth.isReady) return true;
  // Create the observer only once on init
  return new Promise((resolve, reject) => {
    // Use a promise to make sure that the router will eventually show the route after the auth is initialized.
    const unsubscribe = firebase.auth().onAuthStateChanged(
      (user) => {
        resolve(user);
        unsubscribe();
      },
      () => {
        reject(
          new Error(
            'Looks like there is a problem with the firebase service. Please try again later'
          )
        );
      }
    );
  });
}
