import { createStore, applyMiddleware } from 'redux';

// import thunk from 'redux-thunk';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createEncryptor from 'redux-persist-transform-encrypt';
import storageSession from 'redux-persist/lib/storage/session';
import CryptoJS from 'crypto-js';
import { encryptTransform } from 'redux-persist-transform-encrypt';

import rootReducer from './reducers';
// let transforms = [];
// const encryptionTransform = encryptTransform({
//   secretKey: process.env.MY_SECRET_KEY,
// });
// transforms.push(encryptionTransform);
const persistConfig = {
  key: 'root',
  // storage,
  // storage: storageSession,
  storage,
  whitelist: ['walletEncrypted'],
};
// persistConfig.transforms = transforms;
const persistedReducer = persistReducer(persistConfig, rootReducer);

let store = createStore(persistedReducer);
let persistor = persistStore(store);
export { store, persistor };
