import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { CREATE_WALLET } from '../../redux/actionTypes';
import { decrypt } from '../../utils/utils';

const Seedphrase = props => {
  const { history } = props;
  const [mnemonics, setMnemonics] = useState('');
  const { data, hashedPassword } = useSelector(
    ({ walletEncrypted }) => walletEncrypted?.walletEncrypted
  );

  console.log('REDUX===', data, hashedPassword);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: CREATE_WALLET,
      payload: {
        isLoggedIn: true,
      },
    });

    (async () => {
      const { mnemonic } = await decrypt(data, hashedPassword);
      console.log('MN===', mnemonic);
      setMnemonics(mnemonic.phrase);
    })();
  }, []);

  // console.log('WALLET=========', wallet?.mnemonic);

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
