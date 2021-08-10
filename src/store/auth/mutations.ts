import { MutationTree } from 'vuex';
import { AuthStateInterface } from './state';

const mutation: MutationTree<AuthStateInterface> = {
  setAuthState(state, data: AuthStateInterface) {
    state.isAuthenticated = data.isAuthenticated;
    state.isReady = data.isReady;
    state.uid = data.uid;
  },
};

export default mutation;
