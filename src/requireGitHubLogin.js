import randomString from 'crypto-random-string';
import qs from 'qs';
import GitHub from 'github-api';


const GITHUB_STATE_KEY = 'github_state',
  GITHUB_TOKEN_KEY = 'github_token';

function goToLogIn({ scope, client_id, redirect_uri }) {
  // state variable to prevent csrf
  const state = randomString(10);
  localStorage.setItem(GITHUB_STATE_KEY, state);

  location.href =
    `https://github.com/login/oauth/authorize?${qs.stringify({ client_id, scope, redirect_uri, state })}`;
}

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

/**
 * This function returns a promise that only resolves with a token that has the matching scopes
 *
 * @returns {Promise} that resolves only with the user's GitHub login token
 */
export default function requireGitHubLogin({ scope, client_id, redirect_uri }) {
  const storedToken = localStorage.getItem(GITHUB_TOKEN_KEY),
    storedState = localStorage.getItem(GITHUB_STATE_KEY);

  const handleError = error => {
    console.error(error);
    goToLogIn({ scope, client_id, redirect_uri });
  };

  if (typeof location.search === 'string' && location.search.length > 1) {
    // user attempted to log in
    localStorage.removeItem(GITHUB_TOKEN_KEY);

    try {
      const data = qs.parse(location.search.substr(1));

      return tradeCodeForToken({ code: data.code, state: storedState })
        .then(
          access_token => {
            localStorage.setItem(GITHUB_TOKEN_KEY, access_token);
            return access_token;
          }
        )
        .catch(handleError);
    } catch (error) {
      handleError(error);
    }
  } else if (typeof storedToken === 'string' && storedToken.trim().length > 0) {

    // check that the token is valid that is stored
    return (new GitHub({ token: storedToken })).getUser()
      .getProfile()
      .then(
        ({ data }) => {
          return storedToken;
        }
      )
      .catch(handleError);
  } else {

    handleError(new Error('not logged in'));
    return Promise.reject(new Error('not logged in'));
  }
}