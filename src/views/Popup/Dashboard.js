import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';
import Tx from '@ethereumjs/tx';

import { decrypt } from '../../utils/utils';

// const Tx = require('ethereumjs-tx');

// import { REMOVE_MNEMONIC } from '../../redux/actionTypes';

const Dashboard = () => {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [address, setAddress] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [balance, setBalance] = useState('');
  const [network, setNetwork] = useState('rinkeby');

  const { data, hashedPassword } = useSelector(
    ({ walletEncrypted }) => walletEncrypted?.walletEncrypted
  );

  useEffect(() => {
    // var customHttpProvider = new ethers.providers.JsonRpcProvider(
    //   'https://rinkeby.infura.io/v3/2107de90a19f4dd69c0eef59805a707e'
    // );
    // customHttpProvider.getBlockNumber().then(result => {
    //   console.log('Current block number: ' + result);
    // });
    // const provider = ethers.getDefaultProvider(
    //   '2107de90a19f4dd69c0eef59805a707e'
    // );
    // console.log('PROVIDER====', provider);
    // let network = {
    //   name: 'rinkbey',
    //   chainId: 4,
    //   // ensAddress: '',
    // };
    // const itx = new ethers.providers.InfuraProvider({
    //   network,
    //   apiKey: '2107de90a19f4dd69c0eef59805a707e',
    // });
    // console.log('PROVIDER===', itx);
  }, []);

  useEffect(() => {
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
  }, []);

  let provider;

  useEffect(() => {
    (async () => {
      try {
        provider = ethers.getDefaultProvider(network);
        provider.getBlockWithTransactions();
        console.log('PROVIDER', provider);
        const balance = await provider.getBalance(address);
        setBalance(ethers.utils.formatEther(balance));
      } catch (error) {
        console.log('ERR===', error);
      }
    })();
  }, [network, balance]);

  // useEffect(() => {
  //   //get the Provider Etherscan
  //   let etherscanProvider = new ethers.providers.EtherscanProvider(
  //     network || 'rinkeby'
  //   );

  //   //Get the transaction history
  //   etherscanProvider.getHistory(address).then(history => {
  //     history.forEach(tx => {
  //       console.log('tx================', tx);
  //     });
  //   });
  // }, []);

  const sendTransaction = async () => {
    try {
      let tx = {
        to: '0x9f3b9E55285A761b29C83959C81164a5A894767B',
        value: ethers.utils.parseEther('0.00005'),
      };

      const walletMneomnic = await decrypt(data, hashedPassword);

      await walletMneomnic.signTransaction(tx);
      let wallet = walletMneomnic.connect(provider);
      let tr = await wallet.sendTransaction(tx);
      console.log('TRANS===========', tr);
      setBalance(balance - 0.00005);

      alert('Send finished!');
    } catch (error) {
      console.log('ERROR=====', error);
    }
  };

  return (
    <div>
      <h3>Public Key: {publicKey}</h3>
      <h3>PRIVATE KEY: {privateKey}</h3>
      <h3>Address: {address}</h3>
      <h3>SEED PHRASE: {seedPhrase}</h3>
      <select onChange={e => setNetwork(e.target.value)}>
        <option value='homestead'>Ethereum Mainnet</option>
        <option value='rinkeby' selected>
          Rinkeby
        </option>
        <option value='ropsten'>Ropsten</option>
        <option value='kovan'>Kovan</option>
        <option value='goerli'>Goerili</option>
      </select>
      <p>Your Balance: {balance} ETH</p>

      <button onClick={sendTransaction}>Send</button>
    </div>
  );
};

export default Dashboard;

// melt confirm jump know romance arm audit flush lake select energy glad
