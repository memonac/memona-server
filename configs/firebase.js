const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const FIREBASE_CONFIG_INFO = require("./firebaseEnv");

const firebaseConfig = {
  apiKey: FIREBASE_CONFIG_INFO.apiKey,
  authDomain: FIREBASE_CONFIG_INFO.authDomain,
  projectId: FIREBASE_CONFIG_INFO.projectId,
  storageBucket: FIREBASE_CONFIG_INFO.storageBucket,
  messagingSenderId: FIREBASE_CONFIG_INFO.messagingSenderId,
  appId: FIREBASE_CONFIG_INFO.appId,
  measurementId: FIREBASE_CONFIG_INFO.measurementId,
};

const app = initializeApp(firebaseConfig);

exports.authenication = getAuth(app);
