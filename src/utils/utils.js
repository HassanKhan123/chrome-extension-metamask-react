import axios from 'axios';
import { ethers } from 'ethers';
import { ETHERSCAN_API, ETHERSCAN_API_KEY } from '../constants';

export const decrypt = async (data, hashedPassword) => {
  let decryptData = await ethers.Wallet.fromEncryptedJson(data, hashedPassword);
  return decryptData;
};

export const fetchRates = async coinId => {
  const { data } = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
  );

  return data;
};

export const fetchERC20Balance = async (address, contractAddress) => {
  const { data } = await axios.get(
    `${ETHERSCAN_API}?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`
  );
  return data;
};
