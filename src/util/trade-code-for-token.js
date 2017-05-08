/**
 * this function hits our api gateway endpoint to trade a github oauth access code for a token
 * unfortunately this is necessary because github does not support the oauth implicit flow
 * this endpoint only works for a couple of client ids
 *
 * @param code
 * @param state
 * @param client_id
 * @returns {Promise.<TResult>}
 */
export default function tradeCodeForToken({ code, state, client_id }) {
  return fetch(
    'https://5rcclflcdh.execute-api.us-west-2.amazonaws.com/prod/access_token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ code, state, client_id })
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