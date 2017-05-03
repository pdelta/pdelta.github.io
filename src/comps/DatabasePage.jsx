import React, { PropTypes, PureComponent } from 'react';
import { deleteDatabase, getDatabase } from '../dao';

export default class DatabasePage extends PureComponent {
  static contextTypes = {
    token: PropTypes.string.isRequired
  };

  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        owner: PropTypes.string.isRequired,
        repo: PropTypes.string.isRequired
      })
    }).isRequired
  };

  static defaultProps = {};

  deleteDb = () => {
    const { match: { params: { owner, repo } } } = this.props;
    const { token } = this.context;
    const dbName = `${owner}/${repo}`;

    const typeName = prompt(`Type database name to delete: ${dbName}`);

    if (typeName === dbName) {
      getDatabase(token, owner, repo)
        .then(database => deleteDatabase(token, database))
        .then(() => alert('Deleted!'))
        .catch(error => alert(error.message));
    } else if (typeName !== null) {
      alert('invalid name!');
    }
  };

  loadDb = id => {
    const { token } = this.context;


  };


  render() {
    const { match: { params: { owner, repo } } } = this.props;

    return (
      <div>
        <h1>
          <span>{repo}</span>
          <small style={{ marginLeft: 10 }}>
            <i className="fa fa-trash text-danger" style={{ cursor: 'pointer' }} onClick={this.deleteDb}/>
          </small>
        </h1>
      </div>
    );
  }
}