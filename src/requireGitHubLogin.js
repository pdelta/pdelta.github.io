import crypto from 'crypto';
import qs from 'qs';
import _ from 'underscore';

const GITHUB_STATE_KEY = 'github_state',
  GITHUB_TOKEN_KEY = 'github_token';

const randomString = len => {
  if (!Number.isFinite(len)) {
    throw new TypeError('Expected a finite number');
  }

  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len);
};

function tradeCodeForToken({ code, state }) {
  return fetch(
    'https://5rcclflcdh.execute-api.us-west-2.amazonaws.com/prod/access_token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ code, state })
    })
    .then(res => res.json())
    .then(
      res => {
        if (res.error) {
          throw new Error(res.error);
        }

        return res.access_token;
      }
    );
}

const cleanScopeArray = scopes => _.chain(scopes)
  .filter(s => typeof s === 'string')
  .filter(s => s.trim().length > 0)
  .map(s => s.trim().toLowerCase())
  .value();

// hits the profile endpoint and gets the scopes for the token out the header
function getScopes(token) {
  return fetch(
    'https://api.github.com/user',
    {
      headers: {
        'Authorization': `token ${token}`
      }
    })
    .then(res => cleanScopeArray(res.headers.get('X-OAuth-Scopes').split(',')));
}

export default function requireGitHubLogin({ scope, client_id, redirect_uri }) {
  const storedToken = localStorage.getItem(GITHUB_TOKEN_KEY),
    storedState = localStorage.getItem(GITHUB_STATE_KEY);

  const hasAllScopes = scopes => _.all(
    cleanScopeArray(scope.split(' ')),
    requestedScope => _.contains(scopes, requestedScope.trim().toLowerCase())
  );

  const handleError = error => {
    // we are not logged in if we encounter an error
    localStorage.removeItem(GITHUB_TOKEN_KEY);

    // log the error
    console.error(error);

    // state variable to prevent csrf
    const state = randomString(10);
    localStorage.setItem(GITHUB_STATE_KEY, state);

    location.href =
      `https://github.com/login/oauth/authorize?${qs.stringify({ client_id, scope, redirect_uri, state })}`;

    return Promise.reject(new Error('returning to log in!'));
  };

  if (typeof location.search === 'string' && location.search.length > 1) {
    // user attempted to log in
    localStorage.removeItem(GITHUB_TOKEN_KEY);

    try {
      const queryData = qs.parse(location.search.substr(1));

      return tradeCodeForToken({ code: queryData.code, state: storedState })
        .then(
          access_token => {
            location.search = qs.stringify(_.omit(queryData, [ 'code', 'state' ]));
            localStorage.setItem(GITHUB_TOKEN_KEY, access_token);
            return Promise.all([ access_token, getScopes(access_token) ]);
          }
        )
        .then(
          ([ access_token, scopes ]) => {
            if (!hasAllScopes(scopes)) {
              throw new Error('not all scopes authorized');
            }

            return access_token;
          }
        )
        .catch(handleError);
    } catch (error) {
      return handleError(error);
    }
  } else if (typeof storedToken === 'string' && storedToken.trim().length > 0) {

    // check that the token is valid that is stored
    return getScopes(storedToken)
      .then(
        scopes => {
          if (!hasAllScopes(scopes)) {
            throw new Error('not all scopes authorized');
          }

          return storedToken;
        }
      )
      .catch(handleError);
  } else {
    return handleError(new Error('not logged in'));
  }
}