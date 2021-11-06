import React from 'react';
import { createMemoryHistory /* , createBrowserHistory */ } from 'history';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import Welcome from './Welcome';
import CreatePassword from './CreatePassword';
import Seedphrase from './SeedPhrase';
import Dashboard from './Dashboard';
import Recover from './Recover';

import './App.css';
import customToken from './customToken';

function App() {
  const history = createMemoryHistory();
  return (
    <BrowserRouter history={history}>
      <Switch>
        <Route path='/popup.html' component={Welcome} />
        <Route path='/create-password' component={CreatePassword} />
        <Route path='/seed-phrase' component={Seedphrase} />
        <Route path='/dashboard' component={Dashboard} />
        <Route path='/recover' component={Recover} />
        <Route path='/create-token' component={customToken} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
