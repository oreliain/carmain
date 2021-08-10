import * as BaseServices from './base';
import * as StoreServices from './store';
import * as EmailServices from './email';
import * as DatabaseServices from './db';
export type FirebaseServicesType = typeof BaseServices & typeof StoreServices & typeof EmailServices & typeof DatabaseServices;
export default Object.assign({}, BaseServices, StoreServices, EmailServices, DatabaseServices) as FirebaseServicesType;
