import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';
import { useHistory } from 'react-router-dom';
import web3 from 'web3';

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
    let hashedPassword = ethers.utils.hashMessage(password);
    console.log('HASHED============', hashedPassword);

    let encryptPromise = await randomSeed.encrypt(hashedPassword);

    console.log('ENCRYOPTED====', encryptPromise);

    dispatch({
      type: CREATE_WALLET_ENCRYPTED,
      payload: {
        hashedPassword,
        data: encryptPromise,
        walletCreated: true,
      },
    });

    history.push('/seed-phrase');
    // let decryptData = await ethers.Wallet.fromEncryptedJson(
    //   encryptPromise,
    //   hashedPassword
    // );
    // console.log('DECR====', decryptData);

    // let mnemonicWallet = ethers.Wallet.fromMnemonic(randomSeed.mnemonic.phrase);
    // console.log('PRIATE KEY-------------', mnemonicWallet.privateKey);
    // let ciphertext = CryptoJS.AES.encrypt(
    //   JSON.stringify(randomSeed.mnemonic.phrase),
    //   hashedPassword
    // ).toString();
    // console.log('CIPHER====', ciphertext);
    // let encryptedKey = ethers.Wallet.fromEncryptedJson(
    //   JSON.stringify(mnemonicWallet.privateKey),
    //   password
    // );
    // console.log('ENCRYPTED=============', encryptedKey);
    // web3.eth.accounts.encrypt(
    //   mnemonicWallet.privateKey,
    //   password
    // );
    // localStorage.setItem('seedphrase', ciphertext);

    // sessionStorage.setItem('isLoggedIn', true);

    // dispatch({
    //   type: CREATE_WALLET_ENCRYPTED,
    //   payload: {
    //     mnemonic: randomSeed.mnemonic.phrase,
    //     mnemonicEncrypted: ciphertext,
    //     hashedPassword,
    //     key: encryptedKey,
    //     walletCreated: true,
    //   },
    // });
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
