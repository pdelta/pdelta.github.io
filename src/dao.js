import _ from 'underscore';

const ts = () => (new Date()).getTime();

export const expectStatus = (expectedStatus, msg = 'api failure!') =>
  res => {
    if (res.status !== expectedStatus) {
      throw new Error(msg);
    }

    return res;
  };

const toJson = res => res.json();

const jf = (token, url, options) => fetch(
  url,
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

export function getProfile(token) {
  return jf(token, 'https://api.github.com/user')
    .then(expectStatus(200, 'failed to fetch profile'))
    .then(toJson);
}

export function getDatabases(token) {
  return jf(token, `https://api.github.com/user/repos?visibility=private&_ts=${ts()}`)
    .then(expectStatus(200, 'failed to list databases'))
    .then(toJson)
    .then(
      repositories => _.filter(repositories, ({ name }) => name.indexOf('gitlock-db-') === 0)
    );
}

export function getDatabase(token, owner, name) {
  return jf(token, `https://api.github.com/repos/${owner}/gitlock-db-${name}?_ts=${ts()}`)
    .then(expectStatus(200))
    .then(toJson);
}

export function createDatabase(token, database) {
  if (database.name.trim().length === 0) {
    return Promise.reject(new Error('Invalid database name!'));
  }

  return jf(token, `https://api.github.com/user/repos`,
    {
      method: 'POST',
      body: JSON.stringify({
        ...database,
        name: `gitlock-db-${database.name}`,
        private: true
      })
    })
    .then(expectStatus(201))
    .then(toJson);
}

export function deleteDatabase(token, { owner: { login }, name }) {
  return jf(token, `https://api.github.com/repos/${login}/${name}`, { method: 'DELETE' })
    .then(expectStatus(204));
}