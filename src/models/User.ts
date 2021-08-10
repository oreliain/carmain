export class UserData {
  id: string;
  backgroundPhoto: string;
  email: string;
  fullName: string;
  mobile: string;
  profilePhoto: string;
}

export default class User extends UserData {
  constructor(opts: Partial<UserData>) {
    super();
    const keys = <Array<keyof UserData>>Object.keys(opts);
    keys.forEach((dataKey) => {
      this[dataKey] = opts[dataKey];
    });
  }

  toJSON(): Partial<UserData> {
    const keys: Array<keyof UserData> = [
      'id',
      'email',
      'backgroundPhoto',
      'profilePhoto',
      'mobile',
      'fullName',
    ];
    const result: Partial<UserData> = {};
    keys.forEach((key) => {
      if (this[key] !== undefined) {
        result[key] = this[key];
      }
    });
    return result;
  }
}
