import _ from 'underscore';

export function getDatabases(token) {
  return fetch(
    `https://api.github.com/user/repos?visibility=private`,
    {
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Authorization': `token ${token}`
      }
    })
    .then(
      res => res.json()
    )
    .then(
      repositories => _.filter(repositories, ({ name }) => name.indexOf('gitlock-db-') === 0)
    );
}

export function createDatabase(token, database) {
  if (database.name.length < 0) {
    return Promise.reject(new Error('Invalid database name!'));
  }

  return fetch(
    `https://api.github.com/user/repos`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `token ${token}`
      },
      body: JSON.stringify({
        ...database,
        name: `gitlock-db-${database.name}`,
        private: true
      })
    }
  ).then(
    res => res.json()
  );
}

export function deleteDatabase(token, { owner: { login }, name }) {
  return fetch(
    `https://api.github.com/repos/${login}/${name}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `token ${token}`
      }
    }
  ).then(
    res => {
      if (res.status === 204) {
        return true;
      }

      throw new Error('Failed to delete database!');
    }
  );
}