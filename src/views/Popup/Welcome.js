import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PopupPage = props => {
  const history = useHistory();
  const wallet = useSelector(({ wallet }) => wallet?.wallet);
  console.log('WALLET===========', wallet);
  useEffect(() => {
    if (wallet?.isLoggedIn) {
      history.push('/dashboard');
    }
  }, []);
  return (
    <div style={{ height: 300, width: 300 }}>
      <button>Import Wallet</button>
      <Link to='/create-password'>
        <button>Create a wallet</button>
      </Link>
    </div>
  );
};

export default PopupPage;
