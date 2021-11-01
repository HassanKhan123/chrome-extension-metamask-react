import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ethers, Signer } from 'ethers';
import Tx from '@ethereumjs/tx';
import Web3 from 'web3';

import { decrypt } from '../../utils/utils';
import { abi } from '../../erc721/abi.json';

var Contract = require('web3-eth-contract');
// const Tx = require('ethereumjs-tx');

// import { REMOVE_MNEMONIC } from '../../redux/actionTypes';

const Dashboard = () => {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [address, setAddress] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [balance, setBalance] = useState(0);
  const [network, setNetwork] = useState('rinkeby');
  const [encryptedData, setEncryptedData] = useState('');
  const [encryptedPassword, setEncryptedPassword] = useState('');

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

            const { publicKey, address, privateKey, mnemonic } = await decrypt(
              data,
              hashedPassword
            );
            setPublicKey(publicKey);
            setAddress(address);
            setPrivateKey(privateKey);
            setSeedPhrase(mnemonic.phrase);
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

            const { publicKey, address, privateKey, mnemonic } = await decrypt(
              data,
              hashedPassword
            );
            setPublicKey(publicKey);
            setAddress(address);
            setPrivateKey(privateKey);
            setSeedPhrase(mnemonic.phrase);
          }
        );
      });
    }
  }, []);

  let provider;

  useEffect(() => {
    (async () => {
      try {
        if (network && address) {
          console.log('NETWORK====', network);
          provider = ethers.getDefaultProvider(network);
          provider.getBlockWithTransactions();
          console.log('PROVIDER', provider);
          const balance = await provider.getBalance(address);
          setBalance(ethers.utils.formatEther(balance));
        }
      } catch (error) {
        console.log('ERROR===', error);
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

      const walletMneomnic = await decrypt(encryptedData, encryptedPassword);

      await walletMneomnic.signTransaction(tx);
      let wallet = walletMneomnic.connect(provider);
      if (balance > 0) {
        let tr = await wallet.sendTransaction(tx);
        console.log('TRANS===========', tr);
        setBalance(balance);

        alert('Send finished!');
      } else {
        alert('nOT ENOUGH BALANCE');
      }
    } catch (error) {
      console.log('ERROR=====', error);
    }
  };

  const connectLink = async () => {
    try {
      // const ethProvider = new ethers.providers.JsonRpcProvider(
      //   provider,
      //   network
      // );
      // const signerAccount = ethProvider.getSigner();
      let ethProvider = new ethers.providers.InfuraProvider(network);
      var wallet = ethers.Wallet.fromMnemonic(seedPhrase);
      // ethProvider.getSigner();
      wallet = wallet.connect(ethProvider);

      const contract = new ethers.Contract(
        '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
        abi,
        wallet
        // signerAccount
      );

      let balance = await contract.balanceOf(address);
      console.log('ADDRESS============', balance);
      if (ethers.utils.formatEther(balance) > 0) {
        let transaction = contract.functions.transfer(
          '0x9f3b9E55285A761b29C83959C81164a5A894767B',
          12
        );
        let sendTransactionPromise = wallet.sendTransaction(transaction);

        sendTransactionPromise.then(function (tx) {
          console.log('TXXXXXXXXXXX================', tx);
        });
        alert('link transfered');
      } else {
        alert('nOT ENOUGH BALANCE');
      }
      // Contract.setProvider(provider);

      // var contract = new Contract(
      //   abi,
      //   '0x01BE23585060835E02B77ef475b0Cc51aA1e0709'
      // );

      alert('link transfered');
    } catch (error) {
      console.log('ERROR=========', error);
    }
  };
  return (
    <div>
      <h3>Public Key: {publicKey}</h3>
      <h3>PRIVATE KEY: {privateKey}</h3>
      <h3>Address: {address}</h3>
      <h3>SEED PHRASE: {seedPhrase}</h3>
      <select onChange={e => setNetwork(e.target.value)}>
        <option value='rinkeby'>Rinkeby</option>
        <option value='homestead'>Ethereum Mainnet</option>
        <option value='ropsten'>Ropsten</option>
        <option value='kovan'>Kovan</option>
        <option value='goerli'>Goerili</option>
      </select>
      <p>Current Network: {network}</p>
      <p>Your Balance: {balance} ETH</p>

      <button onClick={sendTransaction}>Send</button>
      <button onClick={connectLink}>LINK TOKEN</button>
    </div>
  );
};

export default Dashboard;

// melt confirm jump know romance arm audit flush lake select energy glad
