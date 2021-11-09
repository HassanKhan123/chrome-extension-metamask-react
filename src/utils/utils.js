import axios from 'axios';
import { ethers } from 'ethers';

import { abi } from '../erc720/abi.json';
import {
  ETHERSCAN_API,
  ETHERSCAN_API_KEY,
  ETHERSCAN_MAINNET_API,
  ETHERSCAN_RINKEBY_API,
} from '../constants';

export const decrypt = async (data, hashedPassword) => {
  let decryptData = await ethers.Wallet.fromEncryptedJson(data, hashedPassword);
  return decryptData;
};

export const fetchRates = async coinId => {
  const { data } = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
  );

  let id = coinId;

  return data[id.toLowerCase()].usd;
};

export const fetchERC20Balance = async (address, contractAddress, netowrk) => {
  let BASEURL =
    netowrk === 'homestead' ? ETHERSCAN_MAINNET_API : ETHERSCAN_RINKEBY_API;
  const { data } = await axios.get(
    `${BASEURL}?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`
  );
  return data;
};

export const fetchTxHistory = async (address, netowrk) => {
  let BASEURL =
    netowrk === 'homestead' ? ETHERSCAN_MAINNET_API : ETHERSCAN_RINKEBY_API;
  const { data } = await axios.get(
    `${BASEURL}?module=account&action=txlist&address=${address}&sort=asc&apikey=${ETHERSCAN_API_KEY}`
  );
  return data;
};

export const fetchERC20TxHistory = async (address, netowrk) => {
  let BASEURL =
    netowrk === 'homestead' ? ETHERSCAN_MAINNET_API : ETHERSCAN_RINKEBY_API;
  const { data } = await axios.get(
    `${BASEURL}?module=account&action=tokentx&address=${address}&sort=asc&apikey=${ETHERSCAN_API_KEY}`
  );
  return data;
};

export const fetchERC20TokenInfo = async (address, netowrk) => {
  let BASEURL =
    netowrk === 'homestead' ? ETHERSCAN_MAINNET_API : ETHERSCAN_RINKEBY_API;
  const { data } = await axios.get(
    `${BASEURL}?module=account&action=tokentx&address=${address}&sort=asc&apikey=${ETHERSCAN_API_KEY}`
  );
  return data;
};

export const fetchETHBalance = async (address, netowrk) => {
  let BASEURL =
    netowrk === 'homestead' ? ETHERSCAN_MAINNET_API : ETHERSCAN_RINKEBY_API;
  const { data } = await axios.get(
    `${BASEURL}?module=account&action=balance&&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`
  );
  return data;
};

export const send_token = async (
  contract_address,
  send_token_amount,
  to_address,
  send_account,
  private_key,
  provider
) => {
  let wallet = new ethers.Wallet(private_key);
  let walletSigner = wallet.connect(provider);

  let currentGasPrice = await provider.getGasPrice();

  let gas_price = ethers.utils.hexlify(parseInt(currentGasPrice));
  console.log(` gas_price: ${gas_price} `);

  if (contract_address) {
    // general token send
    let contract = new ethers.Contract(contract_address, abi, walletSigner);

    // How many tokens?
    let numberOfTokens = ethers.utils.parseUnits(send_token_amount, 18);
    console.log(` numberOfTokens: ${numberOfTokens} `);

    // Send tokens
    let transferResult = await contract.functions.transfer(
      to_address,
      numberOfTokens
    );

    console.dir(transferResult);
    alert('sent token');
  } // ether send
  else {
    const tx = {
      from: send_account,
      to: to_address,
      value: ethers.utils.parseEther(send_token_amount),
      nonce: provider.getTransactionCount(send_account, 'latest'),
      gasLimit: ethers.utils.hexlify('0x100000'), // 100000
      gasPrice: gas_price,
    };
    console.dir(tx);
    try {
      let transaction = await walletSigner.sendTransaction(tx);

      console.dir(transaction);
      alert('Send finished!');
    } catch (error) {
      alert('failed to send !!');
    }
  }
};
