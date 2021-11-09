import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ethers, Signer } from 'ethers';
import Tx from '@ethereumjs/tx';
import Web3 from 'web3';

import {
  decrypt,
  fetchERC20Balance,
  fetchERC20TokenInfo,
  fetchERC20TxHistory,
  fetchETHBalance,
  fetchTxHistory,
  send_token,
} from '../../utils/utils';
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
  const [network, setNetwork] = useState('homestead');
  const [encryptedData, setEncryptedData] = useState('');
  const [encryptedPassword, setEncryptedPassword] = useState('');
  const [totalBalance, setTotalBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState({
    balance: 0,
    balanceInUSD: 0,
  });
  const [ethUsdPrice, setEthUSDPrice] = useState(0);
  const [linkBalance, setLinkBalance] = useState(0);
  const [txHistory, setTxHistory] = useState([]);
  const [customTokens, setCustomTokens] = useState([]);

  useEffect(() => {
    chrome.storage.sync.get(['tokens'], async ({ tokens }) => {
      console.log('TOKENS==============', tokens);
      if (tokens) {
        // const getCustomTokenData = await fetchERC20TokenInfo(address)
        setCustomTokens(tokens);
      }
    });
  }, []);

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
          // console.log('NETWORK====', network);

          let sum = 0;
          if (customTokens.length > 0) {
            let tk = await Promise.all(
              customTokens.map(async ctx => {
                const linkBal = await fetchERC20Balance(
                  address,
                  ctx.contractAddress,
                  network
                );

                const usdPrice = await fetchRates(ctx.symbol, network);

                console.log('LIN============', linkBal);
                sum += ethers.utils.formatUnits(linkBal.result) * usdPrice;

                return {
                  ...ctx,
                  balance: ethers.utils.formatUnits(linkBal.result),
                  usdPrice,
                  balanceInUSD:
                    ethers.utils.formatUnits(linkBal.result) * usdPrice,
                };
              })
            );

            console.log('CUST=========', tk);

            setCustomTokens(tk);
          }

          console.log('SUM==============', sum);
          const ethRate = await fetchRates('ethereum', network);
          setEthUSDPrice(ethRate);
          const balance = await fetchETHBalance(address, network);
          setBalance(ethers.utils.formatUnits(balance.result));
          setEthBalance({
            balance: ethers.utils.formatUnits(balance.result),
            balanceInUSD: ethRate * ethers.utils.formatUnits(balance.result),
          });

          setTotalBalance(
            sum + ethRate * ethers.utils.formatUnits(balance.result)
          );
          // const linkRate = await fetchRates('chainlink');

          // setTotalBalance(
          //   ethRate.ethereum.usd * ethers.utils.formatEther(balance) +
          //     linkRate.chainlink.usd * ethers.utils.formatUnits(linkBal.result)
          // );
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

  useEffect(() => {
    if (address) {
      (async () => {
        const txHist = await fetchTxHistory(address, network);
        const txERC20Hist = await fetchERC20TxHistory(address, network);

        setTxHistory([...txHist.result, ...txERC20Hist.result]);
      })();
    }
  }, [address, network]);

  const sendTransaction = async () => {
    provider = ethers.getDefaultProvider(network);
    provider.getBlockWithTransactions();
    console.log('PROVIDER', provider);
    try {
      const send = await send_token(
        '',
        '0.0005',
        '0x7365eAC43B90a8D2a98cf2BE32C69568b3b5C7A7',
        address,
        privateKey,
        provider
      );

      console.log('SEND====', send);
      // let tx = {
      //   to: '0x7365eAC43B90a8D2a98cf2BE32C69568b3b5C7A7',
      //   value: ethers.utils.parseEther('0.00005'),
      // };

      // const walletMneomnic = await decrypt(encryptedData, encryptedPassword);

      // await walletMneomnic.signTransaction(tx);
      // let wallet = walletMneomnic.connect(provider);
      // if (balance > 0) {
      //   let tr = await wallet.sendTransaction(tx);
      //   console.log('TRANS===========', tr);
      //   setBalance(balance);

      //   alert('Send finished!');
      // } else {
      //   alert('nOT ENOUGH BALANCE');
      // }
    } catch (error) {
      console.log('ERROR IN SEND=====', error);
      alert(error.message);
    }
  };

  const connectLink = async () => {
    try {
      let ethProvider = new ethers.providers.InfuraProvider(
        network,
        '2107de90a19f4dd69c0eef59805a707e'
      );
      // provider = ethers.getDefaultProvider(network);
      // provider.getBlockWithTransactions();
      console.log('PROVIDER', ethProvider);
      // var wallet = ethers.Wallet.fromMnemonic(seedPhrase);
      // wallet = wallet.connect(ethProvider);

      let tranfer = await send_token(
        LINK_CONTRACT_ADDRESS,
        '0.1',
        '0x7365eAC43B90a8D2a98cf2BE32C69568b3b5C7A7',
        address,
        privateKey,
        ethProvider
      );
      console.log('TRANSFER=====', tranfer);

      // const contract = new ethers.Contract(
      //   LINK_CONTRACT_ADDRESS,
      //   abi,
      //   wallet
      // );

      // let balance = await contract.balanceOf(address);
      // console.log('ADDRESS============', ethers.utils.formatEther(balance));
      // if (ethers.utils.formatUnits(balance) > 0) {
      //   let transaction = await contract.functions.transfer(
      //     '0x7365eAC43B90a8D2a98cf2BE32C69568b3b5C7A7',
      //     ethers.utils.formatUnits()
      //   );
      //   console.log('TRANSACTION================', transaction);
      //   let sendTransactionPromise = await wallet.sendTransaction(transaction);
      //   console.log('SEND TRANSACTION=============', sendTransactionPromise);

      //   alert('link transfered');
      // } else {
      //   alert('nOT ENOUGH BALANCE');
      // }
    } catch (error) {
      console.log('ERROR SENDING LINK=========', error);
      alert(error.message);
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
        <option value='homestead'>Ethereum Mainnet</option>
        <option value='rinkeby'>Rinkeby</option>
      </select>
      <p>Current Network: {network}</p>
      {/* <p>Your Total ETH in USD: ${totalBalance}</p> */}
      <p>
        ETH BALANCE: {ethBalance.balance} ETH (${ethBalance.balanceInUSD})
      </p>
      <h1>Tokens In Wallet</h1>
      {customTokens.map(ct => (
        <p>
          {ct?.balance} {ct.symbol} (
          {ct.balanceInUSD ? '$' + ct.balanceInUSD : '$0'})
        </p>
      ))}
      {/* <p>LINK BALANCE: ${linkBalance} LINK</p> */}
      <p>TOTA BALANCE IN USD: ${totalBalance}</p>
      <h2>TRANSACTION HISTORY:</h2>
      <p>{txHistory.length}</p>

      <button onClick={sendTransaction}>Send ETH</button>
      <button onClick={connectLink}>SEND LINK</button>
      {/* <button onClick={mintNFT}>Transfer NFT</button> */}

      <Link to='/create-token'>
        <button>Create Token</button>
      </Link>
    </div>
  );
};

export default Dashboard;

// melt confirm jump know romance arm audit flush lake select energy glad
