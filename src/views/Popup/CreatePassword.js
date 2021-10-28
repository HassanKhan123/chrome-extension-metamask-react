import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';
import { useHistory } from 'react-router-dom';

import {
  CREATE_WALLET,
  CREATE_WALLET_ENCRYPTED,
} from '../../redux/actionTypes';

const CreatePassword = () => {
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const history = useHistory();

  const createWallet = async () => {
    let randomSeed = ethers.Wallet.createRandom();

    console.log('SEED PHRASe================', randomSeed.mnemonic);
    console.log('ADDRESS====', randomSeed.address);

    // let mnemonicWallet = ethers.Wallet.fromMnemonic(randomSeed.mnemonic.phrase);
    // console.log('PRIATE KEY-------------', mnemonicWallet.privateKey);
    let ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(randomSeed.mnemonic.phrase),
      password
    ).toString();
    console.log('CIPHER====', ciphertext);
    // localStorage.setItem('seedphrase', ciphertext);

    // sessionStorage.setItem('isLoggedIn', true);

    dispatch({
      type: CREATE_WALLET,
      payload: {
        mnemonic: randomSeed.mnemonic.phrase,
        address: randomSeed.address,
        // key: mnemonicWallet.privateKey,
        walletCreated: true,
      },
    });

    dispatch({
      type: CREATE_WALLET_ENCRYPTED,
      payload: {
        mnemonicEncrypted: ciphertext,
      },
    });

    history.push('/seed-phrase');
  };

  return (
    <div>
      <h1>Enter password</h1>
      <input value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={createWallet}>Submit</button>
    </div>
  );
};

export default CreatePassword;
