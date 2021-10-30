import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { CREATE_WALLET } from '../../redux/actionTypes';
import { decrypt } from '../../utils/utils';

const Seedphrase = props => {
  const { history } = props;
  const [mnemonics, setMnemonics] = useState('');
  const [encryptedData, setEncryptedData] = useState('');
  const [encryptedPassword, setEncryptedPassword] = useState('');

  // const { data, hashedPassword } = useSelector(
  //   ({ walletEncrypted }) => walletEncrypted?.walletEncrypted
  // );

  // console.log('REDUX===', data, hashedPassword);
  const dispatch = useDispatch();

  useEffect(() => {
    let isChrome =
      !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
    console.log('IS CHROME=================', isChrome);

    if (isChrome) {
      chrome.storage.sync.get(['data'], async ({ data }) => {
        console.log('Value currently is ' + data);
        setEncryptedData(data);
        chrome.storage.sync.get(
          ['hashedPassword'],
          async ({ hashedPassword }) => {
            console.log('Value currently is ' + hashedPassword);
            setEncryptedPassword(hashedPassword);

            const { mnemonic } = await decrypt(data, hashedPassword);
            console.log('MN===', mnemonic);
            setMnemonics(mnemonic.phrase);
          }
        );
      });
    } else {
      browser.storage.sync.get(['data'], async ({ data }) => {
        console.log('Value currently is ' + data);
        setEncryptedData(data);
        browser.storage.sync.get(
          ['hashedPassword'],
          async ({ hashedPassword }) => {
            console.log('Value currently is ' + hashedPassword);
            setEncryptedPassword(hashedPassword);

            const { mnemonic } = await decrypt(data, hashedPassword);
            console.log('MN===', mnemonic);
            setMnemonics(mnemonic.phrase);
          }
        );
      });
    }

    dispatch({
      type: CREATE_WALLET,
      payload: {
        isLoggedIn: true,
      },
    });
  }, []);

  return (
    <div>
      <h1>Seed Phrase</h1>
      <h2>{mnemonics}</h2>

      <Link to='/dashboard'>
        <button>Next</button>
      </Link>
    </div>
  );
};

export default Seedphrase;
