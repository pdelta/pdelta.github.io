let config;

if (process.env.NODE_ENV === 'development') {
  config = {
    client_id: '5f5b3968f7732c6333da'
  };
} else {
  config = {
    client_id: 'a55e460d255b503e0048'
  };
}

export default ({ ...config, scope: 'repo' });