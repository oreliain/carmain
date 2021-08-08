import firebase from 'firebase/app'
import 'firebase/auth'

/**
 * Returns Firebase's auth service
 * https://firebase.google.com/docs/reference/js/firebase.auth.html#callable
 * @returns {Auth} - The Firebase Auth service interface
 */
export const auth = () => {
  return firebase.auth()
}

/**
 * Convenience method to initialize firebase app
 * https://firebase.google.com/docs/reference/js/firebase?authuser=1#initializeapp
 * @param  {Object} config - FIREBASE_CONFIG during the build process
 * @returns {App} - Creates and initializes a Firebase app instance.
 */
export const init = (config: Carmain.FirebaseConfiguration) => {
  return firebase.initializeApp(config)
}

/**
 * Removes firebase auth token
 * @returns {Promise} - Void
 */
export const logoutUser = () => {
  return auth().signOut()
}
