let config;

if (process.env.NODE_ENV === 'development') {
  config = {
    client_id: '5f5b3968f7732c6333da'
  };
} else {
  config = {
    client_id: 'a4875587649de6c23f3d'
  };
}

export default ({ ...config, scope: 'repo' });