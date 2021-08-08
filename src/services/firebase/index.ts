import * as BaseServices from './base';
import * as StoreServices from './store';
import * as EmailServices from './email';
const services = Object.assign({}, BaseServices, StoreServices, EmailServices);
export type FirebaseServicesType = typeof services;
export default services;
