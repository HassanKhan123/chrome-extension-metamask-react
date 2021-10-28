import { ethers } from 'ethers';

export const decrypt = async (data, hashedPassword) => {
  let decryptData = await ethers.Wallet.fromEncryptedJson(data, hashedPassword);
  return decryptData;
};
