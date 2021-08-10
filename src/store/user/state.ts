import { UserData } from '../../models/User';

export type UserStateInterface = ReturnType<typeof state>;

function state() {
  return {
    currentUser: null as UserData,
    editUserDialog: false,
  };
}

export default state;
