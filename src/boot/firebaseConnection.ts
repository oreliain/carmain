import { boot } from 'quasar/wrappers';
import FirebaseService from '../services/firebase';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ app, router, store }) => {
  FirebaseService.init(process.env.CONFIG.FIREBASE);

  FirebaseService.auth().onAuthStateChanged(
    async (user) => {
      await FirebaseService.handleOnAuthStateChanged(store, router, user);
    },
    (error) => {
      console.error(error);
    }
  );
  app.config.globalProperties.$fb = store.$fb = FirebaseService;
});
