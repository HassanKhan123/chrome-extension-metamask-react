import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ethers } from 'ethers';
import Web3 from 'web3';

import { decrypt } from '../../utils/utils';
import { abi } from '../../erc720/abi.json';

let web3;

const CustomToken = () => {
  const history = useHistory();
  const [contractAddress, setContractAddress] = useState('');
  const [decimal, setDecimal] = useState(0);
  const [symbol, setSymbol] = useState('');

  const [address, setAddress] = useState('');

  useEffect(() => {
    web3 = new Web3(
      'https://rinkeby.infura.io/v3/2107de90a19f4dd69c0eef59805a707e'
    );
    chrome.storage.sync.get(['data'], async ({ data }) => {
      console.log('Value currently is ' + data);

      chrome.storage.sync.get(
        ['hashedPassword'],
        async ({ hashedPassword }) => {
          console.log('Value currently is ' + hashedPassword);

          const { address } = await decrypt(data, hashedPassword);
          setAddress(address);
        }
      );
    });
  }, []);

  const fetchToken = async e => {
    setContractAddress(e);
    const contract = new web3.eth.Contract(abi, e);
    let sym = await contract.methods.symbol().call();
    let deci = await contract.methods.decimals().call();

    if (sym && deci) {
      setDecimal(deci);
      setSymbol(sym);
    }
    console.log('SYMBIK========', sym, deci);
  };

  const addToken = async () => {
    if (contractAddress && decimal && symbol) {
      chrome.storage.sync.get(['tokens'], async ({ tokens }) => {
        if (tokens) {
          chrome.storage.sync.set(
            { tokens: [...tokens, { contractAddress, decimal, symbol }] },
            data => {
              console.log('Value is set to Data ' + data);
            }
          );
        } else {
          chrome.storage.sync.set(
            { tokens: [{ contractAddress, decimal, symbol }] },
            data => {
              console.log('Value is set to Data ' + data);
            }
          );
        }
      });
    }

    history.push('/dashboard');
  };

  return (
    <div>
      <input
        value={contractAddress}
        onChange={e => fetchToken(e.target.value)}
      />
      <input value={decimal} onChange={e => setDecimal(e.target.value)} />
      <input value={symbol} onChange={e => setSymbol(e.target.value)} />

      <button onClick={addToken}>Add Token</button>
    </div>
  );
};

export default CustomToken;
