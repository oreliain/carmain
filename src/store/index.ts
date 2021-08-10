import { store } from 'quasar/wrappers';
import { InjectionKey } from 'vue';
import { vuexfireMutations } from 'vuexfire';
import {
  createStore,
  Store as VuexStore,
  useStore as vuexUseStore,
} from 'vuex';
import { FirebaseServicesType } from '../services/firebase';

import auth from './auth';
import { AuthStateInterface } from './auth/state';

import user from './user';
import { UserStateInterface } from 'src/store/user/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export interface StateInterface {
  auth: AuthStateInterface;
  user: UserStateInterface;
}

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: VuexStore<StateInterface>;
  }
}

declare module 'vuex' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $fb: FirebaseServicesType;
  }
}

// provide typings for `useStore` helper
export const storeKey: InjectionKey<VuexStore<StateInterface>> =
  Symbol('vuex-key');

export default store(function (/* { ssrContext } */) {
  return createStore<StateInterface>({
    modules: {
      auth,
      user,
    },
    mutations: {
      ...vuexfireMutations,
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: !!process.env.DEBUGGING,
  });
});

export function useStore() {
  return vuexUseStore(storeKey);
}
