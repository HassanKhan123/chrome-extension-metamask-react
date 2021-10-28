import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { REMOVE_MNEMONIC } from '../../redux/actionTypes';

const Dashboard = () => {
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch({ type: REMOVE_MNEMONIC });
  // }, []);
  const wallet = useSelector(({ wallet }) => wallet?.wallet);
  return (
    <div>
      <h1>Account Address: {wallet?.address}</h1>
    </div>
  );
};

export default Dashboard;
