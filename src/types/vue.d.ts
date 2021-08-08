import { FirebaseServicesType } from '../services/firebase';
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $fb: FirebaseServicesType;
  }
}
