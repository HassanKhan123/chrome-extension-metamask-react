import { CREATE_WALLET_ENCRYPTED, REMOVE_MNEMONIC } from '../actionTypes';

const initialState = {
  walletEncrypted: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case CREATE_WALLET_ENCRYPTED:
      return {
        ...state,
        walletEncrypted: {
          ...state.walletEncrypted,
          ...payload,
        },
      };

    case REMOVE_MNEMONIC:
      return {
        ...state,
        wallet: {
          ...state.walletEncrypted,
          mnemonic: null,
        },
      };

    default:
      return state;
  }
}
