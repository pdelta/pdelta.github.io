import join from 'url-join';

export function expectSuccess(msg = 'api failure!') {
  return function (res) {
    if (res.status >= 200 && res.status < 300) {
      return res;
    } else {
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
    }
  };
}

export const toJson = res => res.json();

export function githubFetch(token, path, options) {
  return fetch(
    join('https://api.github.com', path),
    {
      ...options,
      headers: {
        ...(options ? options.headers : null),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `token ${token}`
      }
    }
  );
}