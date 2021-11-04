import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ethers, Signer } from 'ethers';
import Tx from '@ethereumjs/tx';
import Web3 from 'web3';

import { decrypt, fetchERC20Balance } from '../../utils/utils';
import { abi } from '../../erc720/abi.json';
import { interfaceABI } from '../../erc721/abi.json';
import { fetchRates } from '../../utils/utils';
import { LINK_CONTRACT_ADDRESS } from '../../constants';

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
  const [totalBalance, setTotalBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  const [linkBalance, setLinkBalance] = useState(0);

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
          setEthBalance(ethers.utils.formatEther(balance));

          const linkBal = await fetchERC20Balance(
            address,
            LINK_CONTRACT_ADDRESS
          );
          console.log('LINK====', linkBal);
          setLinkBalance(ethers.utils.formatUnits(linkBal.result));
          const ethRate = await fetchRates('ethereum');
          const linkRate = await fetchRates('chainlink');
          // console.log('RATE====', ethRate.ethereum.usd * balance);
          setTotalBalance(
            // ethers.utils.formatUnits(
            ethRate.ethereum.usd * ethers.utils.formatEther(balance) +
              linkRate.chainlink.usd * ethers.utils.formatUnits(linkBal.result)
            // )
          );
        }
      } catch (error) {
        console.log('ERROR===', error);
      }
    })();
  }, [network, balance]);

  // useEffect(() => {
  //   if (address && network) {
  //     //get the Provider Etherscan
  //     let etherscanProvider = new ethers.providers.EtherscanProvider(
  //       network,
  //       'M193VGUECIDFKWVWAJA9ZPQNKBANY9613B'
  //     );

  //     //Get the transaction history
  //     etherscanProvider.getHistory(address).then(history => {
  //       console.log('HISTORY==============', history.length);
  //       history.forEach(tx => {
  //         console.log('tx================', tx);
  //       });
  //     });
  //   }
  // }, [network, address]);

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
        LINK_CONTRACT_ADDRESS,
        abi,
        wallet
        // signerAccount
      );

      let balance = await contract.balanceOf(address);
      console.log('ADDRESS============', ethers.utils.formatEther(balance));
      if (ethers.utils.formatEther(balance) > 0) {
        let transaction = contract.functions.transfer(
          '0x9f3b9E55285A761b29C83959C81164a5A894767B',
          1
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
    } catch (error) {
      console.log('ERROR=========', error);
    }
  };

  const mintNFT = async () => {
    try {
      let ethProvider = new ethers.providers.InfuraProvider(network);
      var wallet = ethers.Wallet.fromMnemonic(seedPhrase);
      // ethProvider.getSigner();
      wallet = wallet.connect(ethProvider);
      let gas = await wallet.estimateGas();
      console.log('GAS======', gas);
      const contract = new ethers.Contract(
        '0x246385513cabfc852e97cdE9994142C9c1232dFf',
        interfaceABI,
        wallet
        // signerAccount
      );

      // let nonce = await wallet.getTransactionCount(publicKey, 'latest');
      let owner = await contract.functions.ownerOf(
        '30177526000610324733651989421'
      );
      console.log('OWNER=========', owner, address);
      const tx = {
        from: address,
        to: '0x246385513cabfc852e97cdE9994142C9c1232dFf',
        // nonce: nonce,
        gasPrice: ethers.utils.formatEther(gas),
        gasLimit: '8000000000',
        data: contract.functions.transferFrom(
          address,
          '0x5C22594Bac91A1caCd32c53afdcBd2e8350bD0E8',
          '30177526000610324733651989421'

          // publicKey,
          // 'https://gateway.pinata.cloud/ipfs/QmSoQDPCXhL1Vky6GKACnrkzzqf6baAbENam56mV5u4RSz'
        ),
      };

      // let transaction = contract.functions.transfer(
      //   '0x9f3b9E55285A761b29C83959C81164a5A894767B',
      //   12
      // );
      let sendTransactionPromise = wallet.sendTransaction(tx);

      sendTransactionPromise.then(function (tx) {
        console.log('TXXXXXXXXXXX================', tx);
        alert('NFT TRANSFERRED');
      });
    } catch (error) {
      console.log('ERROR============', error);
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
      {/* <p>Your Total ETH in USD: ${totalBalance}</p> */}
      <p>ETH BALANCE: {ethBalance} ETH</p>
      <p>LINK BALANCE: ${linkBalance} LINK</p>
      <p>TOTA BALANCE IN USD: ${totalBalance}</p>

      <button onClick={sendTransaction}>Send</button>
      <button onClick={connectLink}>LINK TOKEN</button>
      <button onClick={mintNFT}>Transfer NFT</button>
    </div>
  );
};

export default Dashboard;

// melt confirm jump know romance arm audit flush lake select energy glad
