import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import { StateInterface } from '../store';
import routes from './routes';
import FirebaseServices from '../services/firebase';
import { Notify } from 'quasar';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route<StateInterface>(function ({ store }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  });

  // Setup the router to be intercepted on each route.
  // This allows the application to halt rendering until
  // Firebase is finished with its initialization process,
  // and handle the user accordingly
  Router.beforeEach(async (to, from, next) => {
    const { ensureAuthIsInitialized, isAuthenticated } = FirebaseServices;
    try {
      // Force the app to wait until Firebase has
      // finished its initialization, and handle the
      // authentication state of the user properly
      await ensureAuthIsInitialized(store);
      if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (isAuthenticated(store)) {
          next();
        } else {
          next('/auth/login');
        }
      } else if (
        (to.path === '/auth/register' && isAuthenticated(store)) ||
        (to.path === '/auth/login' && isAuthenticated(store))
      ) {
        next('/user');
      } else {
        next();
      }
    } catch (err) {
      Notify.create({
        message: `${(err as Error).message}`,
        color: 'negative',
      });
    }
  });

  return Router;
});
