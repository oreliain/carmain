import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { UserStateInterface } from './state';
import { UserData } from '../../models/User';

const getters: GetterTree<UserStateInterface, StateInterface> = {
  currentUser({ currentUser }): Partial<UserData> {
    return currentUser;
  },
  editUserDialog({ editUserDialog }) {
    return editUserDialog;
  },
};

export default getters;
