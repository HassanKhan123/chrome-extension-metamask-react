import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { decrypt } from '../../utils/utils';

// import { REMOVE_MNEMONIC } from '../../redux/actionTypes';

const Dashboard = () => {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [address, setAddress] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');

  const { data, hashedPassword } = useSelector(
    ({ walletEncrypted }) => walletEncrypted?.walletEncrypted
  );

  (async () => {
    const { publicKey, address, privateKey, mnemonic } = await decrypt(
      data,
      hashedPassword
    );
    setPublicKey(publicKey);
    setAddress(address);
    setPrivateKey(privateKey);
    setSeedPhrase(mnemonic.phrase);
  })();
  return (
    <div>
      <h3>Public Key: {publicKey}</h3>
      <h3>PRIVATE KEY: {privateKey}</h3>
      <h3>Address: {address}</h3>
      <h3>SEED PHRASE: {seedPhrase}</h3>
    </div>
  );
};

export default Dashboard;
