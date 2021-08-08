import {store} from 'quasar/wrappers';
import {InjectionKey} from 'vue';
import {createStore, Store as VuexStore, useStore as vuexUseStore,} from 'vuex';

import auth from './auth';
import {AuthStateInterface} from './auth/state';
import {FirebaseServicesType} from '../services/firebase';

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
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: !!process.env.DEBUGGING,
  });
});

export function useStore() {
  return vuexUseStore(storeKey);
}
