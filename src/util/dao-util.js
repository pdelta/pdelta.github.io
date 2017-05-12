import join from 'url-join';
import _ from 'underscore';

export const expectStatus = (expectedStatus = 200, msg = 'api failure!') =>
  res => {
    if (_.isArray(expectedStatus) && _.contains(expectedStatus, res.status)) {
      return res;
    } else if (expectedStatus === res.status) {
      return res;
    }

    return res.json()
      .catch(
        error => {
          console.error(error);
          throw new Error(msg);
        }
      )
      .then(
        errorJson => {
          throw new Error(errorJson.message);
        }
      );
  };

export const toJson = res => res.json();

export const githubFetch = (token, path, options) => fetch(
  join('https://api.github.com', path),
  {
    ...options,
    mode: 'cors',
    headers: {
      ...(options ? options.headers : null),
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `token ${token}`
    }
  }
);