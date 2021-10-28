import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { decrypt } from '../../utils/utils';

// import { REMOVE_MNEMONIC } from '../../redux/actionTypes';

const Dashboard = () => {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [address, setAddress] = useState('');

  const { data, hashedPassword } = useSelector(
    ({ walletEncrypted }) => walletEncrypted?.walletEncrypted
  );

  (async () => {
    const { publicKey, address, privateKey } = await decrypt(
      data,
      hashedPassword
    );
    setPublicKey(publicKey);
    setAddress(address);
    setPrivateKey(privateKey);
  })();
  return (
    <div>
      <h1>Account Address: {publicKey}</h1>
      <h2>{privateKey}</h2>
      <h3>{address}</h3>
    </div>
  );
};

export default Dashboard;
