import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import requireGitHubLogin, { goToLogin } from "./requireGitHubLogin";
import "./index.css";

const render = el => {
  ReactDOM.render(el, document.getElementById('root'));
  document.getElementById('loading-indicator').className += 'loaded';
};

requireGitHubLogin({
  scope: 'repo delete_repo',
  client_id: '5f5b3968f7732c6333da'
})
  .then(
    token => render(<App token={token}/>, root)
  )
  .catch(
    error => {
      render(
        <div style={{ width: '100vw', height: '100vh' }}
             className="display-flex align-items-center justify-content-center">
          <div className="text-center">
            <div className="alert alert-warning">{error.message}</div>

            <div>
              <button className="btn btn-primary btn-sm" onClick={e => {
                e.preventDefault();
                goToLogin({ scope: 'repo delete_repo', client_id: '5f5b3968f7732c6333da' })
              }}><i className="fa fa-sign-in"/> log in
              </button>
            </div>
          </div>
        </div>
      );
    }
  );