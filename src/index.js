import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './comps/App';
import requireGitHubLogin from './util/requireGitHubLogin';
import LoginError from './comps/LoginError';

const render = el => {
  ReactDOM.render(el, document.getElementById('root'));
  document.getElementById('loading-indicator').className += 'loaded';
};

const params = {
  scope: 'repo', client_id: '5f5b3968f7732c6333da'
};

requireGitHubLogin(params)
  .then(token => render(<App token={token}/>))
  .catch(error => render(<LoginError loginParams={params} error={error}/>));