import {
  CREATE_WALLET,
  CREATE_WALLET_ENCRYPTED,
  IMPORT_WALLET,
  REMOVE_MNEMONIC,
} from '../actionTypes';

const initialState = {
  wallet: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case CREATE_WALLET:
      return {
        ...state,
        wallet: {
          ...state.wallet,
          ...payload,
        },
      };

    case REMOVE_MNEMONIC:
      return {
        ...state,
        wallet: {
          ...state.wallet,
          mnemonic: null,
        },
      };

    default:
      return state;
  }
}
