import _ from 'underscore';
import join from 'url-join';

const ts = () => (new Date()).getTime();

const GITLOCK_DB_PREFIX = 'gitlock-db-',
  toRepoName = str => `${GITLOCK_DB_PREFIX}${str}`,
  toDbName = str => str.substring(GITLOCK_DB_PREFIX.length);

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

const toJson = res => res.json();

const jf = (token, path, options) => fetch(
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

export function getProfile(token) {
  return jf(token, 'user')
    .then(expectStatus(200, 'failed to fetch profile'))
    .then(toJson);
}

export function getDatabases(token) {
  return jf(token, `user/repos?visibility=private&_ts=${ts()}`)
    .then(expectStatus(200, 'failed to list databases'))
    .then(toJson)
    .then(
      repositories => _.filter(repositories, ({ name }) => name.indexOf(GITLOCK_DB_PREFIX) === 0)
    )
    .then(
      repositories => _.map(repositories, ({ name, ...rest }) => ({
        ...rest,
        name: toDbName(name)
      }))
    );
}

export function getDatabase(token, owner, name) {
  return jf(token, `repos/${owner}/${toRepoName(name)}?_ts=${ts()}`)
    .then(expectStatus(200))
    .then(toJson)
    .then(
      ({ name, ...rest }) => ({ name: toDbName(name), ...rest })
    );
}

export function saveData(token, { owner: { login }, name }, data) {
  return jf(
    token,
    `repos/${login}/${toRepoName(name)}/contents/data`,
    {
      method: 'PUT',
      body: JSON.stringify({
        message: `${GITLOCK_DB_PREFIX}update-db`,
        content: btoa(data)
      })
    })
    .then(expectStatus(201))
    .then(() => getData(token, { owner: { login }, name }));
}

export function getData(token, { owner: { login }, name }) {
  return jf(token, `repos/${login}/${toRepoName(name)}/contents/data?_ts=${ts()}`)
    .then(expectStatus(200))
    .then(toJson)
    .then(({ content }) => atob(content));
}

export function createDatabase(token, database) {
  if (database.name.trim().length === 0) {
    return Promise.reject(new Error('Invalid database name!'));
  }

  return jf(token, `user/repos`,
    {
      method: 'POST',
      body: JSON.stringify({
        ...database,
        name: `${GITLOCK_DB_PREFIX}${database.name}`,
        private: true
      })
    })
    .then(expectStatus(201))
    .then(toJson)
    .then(
      ({ name, ...rest }) => ({ ...rest, name: toDbName(name) })
    );
}

export function deleteDatabase(token, { owner: { login }, name }) {
  return jf(token, `repos/${login}/${toRepoName(name)}`, { method: 'DELETE' })
    .then(expectStatus(204));
}