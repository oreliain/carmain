declare namespace Carmain {
  interface FirebaseConfiguration {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    FIREBASE_ENV: 'STAGE' | 'PROD' | 'DEV';
    NODE_ENV: string;
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined;
    VUE_ROUTER_BASE: string | undefined;
    CONFIG: {
      FIREBASE: Carmain.FirebaseConfiguration;
    }
  }
}
