import { combineReducers } from 'redux';

import wallet from './wallet';
import walletEncrypted from './walletEncrypted';

export default combineReducers({
  wallet,
  walletEncrypted,
});
