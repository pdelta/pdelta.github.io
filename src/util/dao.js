import { expectStatus, githubFetch, toJson } from './dao-util';
import DEFAULT_README from './default-readme';

const GITLOCK_DB = 'gitlock-db';

const ts = () => new Date().getTime();

/**
 * Creates or gets a README.md corresponding to a github repository
 * @param token used to handle the fetch
 * @param repository in which readme should be fetched/created
 * @returns {Promise.<TResult>}
 */
export function createReadme(token, repository) {
  return githubFetch(
    token, `repos/${repository.full_name}/contents/README.md`,
    {
      method: 'PUT',
      body: JSON.stringify({
        message: 'initialize readme',
        content: btoa(DEFAULT_README)
      })
    })
    .then(expectStatus(201, 'failed to create readme'));
}

/**
 * Get the gitlock db repository for a particular owner
 * @param token
 * @param owner
 * @returns {Promise.<TResult>}
 */
export function getRepository(token, owner) {
  return githubFetch(token, `repos/${owner}/${GITLOCK_DB}?_ts=${ts()}`)
    .then(expectStatus(200, `failed to find repository ${owner}/${GITLOCK_DB}`))
    .then(toJson);
}

export function createRepository(token) {
  return githubFetch(
    token, `user/repos`, {
      method: 'POST',
      body: JSON.stringify({
        name: GITLOCK_DB,
        private: true
      })
    })
    .then(expectStatus(201, 'failed to create repository'))
    .then(toJson)
    .then(repository => Promise.all([ repository, createReadme(token, repository) ]))
    .then(([ repository, readme ]) => repository);
}

export function getData(token, full_name) {
  return githubFetch(token, `repos/${full_name}/contents/data?_ts=${ts()}`)
    .then(expectStatus(200))
    .then(toJson);
}

export function saveData(token, repositoryFullName, options) {
  return githubFetch(
    token,
    `repos/${repositoryFullName}/contents/data`,
    {
      method: 'PUT',
      body: JSON.stringify({
        message: `update-db`,
        ...options
      })
    })
    .then(expectStatus(200, 'failed to save data'))
    .then(toJson);
}
