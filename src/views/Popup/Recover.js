import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import { useHistory } from 'react-router-dom';

import { CREATE_WALLET, IMPORT_WALLET } from '../../redux/actionTypes';
import { decrypt, fetchERC20TokenInfo } from '../../utils/utils';

const Recover = () => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const history = useHistory();

  const onRecover = async () => {
    let filtered = [];
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
    let isChrome =
      !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    console.log('IS CHROME=================', isChrome);

    const { address } = await decrypt(encryptPromise, hashedPassword);

    const customTk = await fetchERC20TokenInfo(address, 'rinkeby');
    console.log('RECOVERED TOKENS======', customTk);
    if (customTk.result.length > 0) {
      let arr = customTk.result;
      console.log('ARR============', arr);

      let obj = {};
      for (let i = 0; i < arr.length; i++) {
        if (!obj[arr[i].tokenSymbol]) {
          obj[arr[i].tokenSymbol] = arr[i];
        }
      }

      console.log('OBJ=============', obj);
      Object.keys(obj).map(name => {
        filtered.push({
          contractAddress: obj[name].contractAddress,
          decimal: obj[name].tokenDecimal,
          symbol: obj[name].tokenSymbol,
        });
      });
    }
    // assault castle genius river soon raw good ill bottom frog start teach
    if (isChrome) {
      chrome.storage.sync.set({ data: encryptPromise }, () => {
        console.log('Value is set to Data ' + encryptPromise);
      });
      chrome.storage.sync.set({ hashedPassword }, () => {
        console.log('Value is set to hashed Password ' + hashedPassword);
      });
      console.log('FILTERED===============', filtered);
      if (filtered.length > 0)
        chrome.storage.sync.set({ tokens: filtered }, () => {
          console.log('Value is set to Data ' + filtered);
        });
    } else {
      browser.storage.sync.set({ data: encryptPromise }, () => {
        console.log('Value is set to Data ' + encryptPromise);
      });
      browser.storage.sync.set({ hashedPassword }, () => {
        console.log('Value is set to hashed Password ' + hashedPassword);
      });
      if (filtered.length > 0)
        browser.storage.sync.set({ tokens: [...filtered] }, ({ tokens }) => {
          console.log('Value is set to Data ' + tokens);
        });
    }

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
