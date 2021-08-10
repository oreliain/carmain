import { MutationTree } from 'vuex';
import { UserStateInterface } from './state';

const mutation: MutationTree<UserStateInterface> = {
  setEditUserDialog(state: UserStateInterface, editDialog: boolean) {
    state.editUserDialog = editDialog;
  },
};

export default mutation;
