import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import { useHistory } from 'react-router-dom';

import { CREATE_WALLET, IMPORT_WALLET } from '../../redux/actionTypes';

const Recover = () => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const history = useHistory();

  const onRecover = async () => {
    let mnemonicWallet = ethers.Wallet.fromMnemonic(seedPhrase);
    console.log('PRIATE KEY-------------', mnemonicWallet);
    let hashedPassword = ethers.utils.hashMessage(password);
    let encryptPromise = await mnemonicWallet.encrypt(hashedPassword);
    dispatch({
      type: IMPORT_WALLET,
      payload: {
        // hashedPassword,
        // data: encryptPromise,
        walletImported: true,
      },
    });

    dispatch({
      type: CREATE_WALLET,
      payload: {
        isLoggedIn: true,
      },
    });

    chrome.storage.sync.set({ data: encryptPromise }, () => {
      console.log('Value is set to Data ' + encryptPromise);
    });
    chrome.storage.sync.set({ hashedPassword }, () => {
      console.log('Value is set to hashed Password ' + hashedPassword);
    });

    history.push('/dashboard');
  };

  return (
    <div>
      <h3>Enter seed phrase</h3>
      <input value={seedPhrase} onChange={e => setSeedPhrase(e.target.value)} />
      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder='Enter Password'
      />

      <button onClick={onRecover}>Recover</button>
    </div>
  );
};

export default Recover;
