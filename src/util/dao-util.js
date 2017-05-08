import join from 'url-join';

export const expectStatus = (expectedStatus, msg = 'api failure!') =>
  res => {
    if (res.status !== expectedStatus) {
      return res.json()
        .catch(
          error => {
            throw new Error(msg);
          }
        )
        .then(
          errorJson => {
            throw new Error(errorJson.message);
          }
        );
    }

    return res;
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