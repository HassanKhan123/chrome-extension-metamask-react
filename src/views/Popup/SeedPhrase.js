import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { CREATE_WALLET } from '../../redux/actionTypes';

const Seedphrase = props => {
  const { history } = props;
  const wallet = useSelector(({ wallet }) => wallet?.wallet);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: CREATE_WALLET,
      payload: {
        isLoggedIn: true,
      },
    });
  }, []);

  console.log('WALLET=========', wallet?.mnemonic);

  return (
    <div>
      <h1>Seed Phrase</h1>
      <h2>{wallet?.mnemonic}</h2>

      <Link to='/dashboard'>
        <button>Next</button>
      </Link>
    </div>
  );
};

export default Seedphrase;
