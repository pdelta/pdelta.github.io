import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './comps/App';
import requireGitHubLogin from './util/require-github-login';
import registerServiceWorker from './registerServiceWorker';
import LoginError from './comps/LoginError';
import config from './config';

registerServiceWorker();

const render = el => {
  ReactDOM.render(el, document.getElementById('root'));
  document.getElementById('loading-indicator').className += 'loaded';
};

requireGitHubLogin(config)
  .then(user => render(<App user={user}/>))
  .catch(error => render(<LoginError loginParams={config} error={error}/>));