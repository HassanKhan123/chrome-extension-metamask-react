import { CREATE_WALLET_ENCRYPTED } from '../actionTypes';

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

    default:
      return state;
  }
}
