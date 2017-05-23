import qs from 'qs';
import _ from 'underscore';
import { randomString } from './crypt';
import { expectSuccess, githubFetch } from './dao-util';
import tradeCodeForToken from './trade-code-for-token';

const GITHUB_STATE_KEY = 'github_state',
  GITHUB_TOKEN_KEY = 'github_token';

export function goToLogin({ client_id, scope, redirect_uri }) {
  // state variable to prevent csrf
  const state = randomString(10);
  window.sessionStorage.setItem(GITHUB_STATE_KEY, state);

  window.location.href =
    `https://github.com/login/oauth/authorize?${qs.stringify({ client_id, scope, redirect_uri, state })}`;
}

const cleanScopeArray = scopeArray => _.chain(scopeArray)
  .filter(s => typeof s === 'string')
  .filter(s => s.trim().length > 0)
  .map(s => s.trim().toLowerCase())
  .value();

function accessTokenToObject({ token, scope }) {
  const hasAllScopes = scopes => _.all(
    cleanScopeArray(scope.split(' ')),
    requestedScope => _.contains(scopes, requestedScope.trim().toLowerCase())
  );

  return githubFetch(token, 'user')
    .then(expectSuccess('failed to get user'))
    .then(
      res => {
        const scopes = cleanScopeArray(res.headers.get('X-OAuth-Scopes').split(','));
        if (!hasAllScopes(scopes)) {
          throw new Error('not all scopes authorized');
        }

        // get the user object out
        return res.json();
      }
    )
    .then(
      profile => ({ token, profile })
    );
}

function getQueryData() {
  if (typeof window.location.search === 'string' && window.location.search.length > 1) {
    try {
      return qs.parse(window.location.search.substr(1));
    } catch (error) {
      return null;
    }
  } else {
    return null;
  }
}

export default function requireGitHubLogin({ scope, client_id }) {
  const storedToken = sessionStorage.getItem(GITHUB_TOKEN_KEY),
    storedState = sessionStorage.getItem(GITHUB_STATE_KEY);

  const handleError = error => {
    // we are not logged in if we encounter an error
    sessionStorage.removeItem(GITHUB_TOKEN_KEY);

    // log the error
    console.error(error);

    return Promise.reject(error);
  };


  const queryData = getQueryData();

  if (queryData !== null && typeof queryData.code === 'string' && queryData.code.trim().length > 0) {
    // user attempted to log in
    sessionStorage.removeItem(GITHUB_TOKEN_KEY);

    try {
      return tradeCodeForToken({ code: queryData.code, state: storedState, client_id })
        .then(
          token => {
            window.history.replaceState(null, null, window.location.origin);

            window.sessionStorage.setItem(GITHUB_TOKEN_KEY, token);
            return accessTokenToObject({ token, scope });
          }
        )
        .catch(handleError);
    } catch (error) {
      return handleError(error);
    }
  } else if (typeof storedToken === 'string' && storedToken.trim().length > 0) {

    // check that the token is valid that is stored
    return accessTokenToObject({ token: storedToken, scope })
      .catch(handleError);
  } else {
    return handleError(new Error('not signed in'));
  }
}