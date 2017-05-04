import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { deleteDatabase, getDatabase } from '../dao';
import Passwords from './Passwords';
import Spinner from './Spinner';

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

  state = {
    database: null,
    promise: null
  };

  componentDidMount() {
    this.loadDb(this.props.match);
  }

  componentWillReceiveProps({ match }) {
    if (this.props.match !== match) {
      this.loadDb(match);
    }
  }

  deleteDb = () => {
    const { match: { params: { owner, repo } } } = this.props;
    const { token } = this.context;
    const dbName = `${owner}/${repo}`;

    const typeName = prompt(`Type database name to delete: ${dbName}`);

    if (typeName === dbName) {
      this.setState({
        promise: getDatabase(token, owner, repo)
          .then(database => deleteDatabase(token, database))
          .then(() => alert('Deleted!'))
          .catch(error => alert(error.message))
      });
    } else if (typeName !== null) {
      alert('invalid name!');
    }
  };

  loadDb = ({ params: { owner, repo } }) => {
    const { token } = this.context;

    this.setState({
      database: null,
      promise: getDatabase(token, owner, repo)
        .then(database => this.setState({ database, promise: null }))
        .catch(error => this.setState({ promise: null }))
    });
  };


  render() {
    const { database, promise } = this.state;

    if (database === null) {
      if (promise !== null) {
        return <Spinner/>;
      } else {
        return <div style={{ margin: 20 }} className="alert alert-danger">Invalid database!</div>;
      }
    }

    const { owner: { login }, name } = database;

    return (
      <div>
        <h1 className="page-header">
          <span>{login}/{name}</span>
          <small style={{ marginLeft: 10 }}>
            <i className="fa fa-trash text-danger" style={{ cursor: 'pointer' }} onClick={this.deleteDb}/>
          </small>
        </h1>

        <div>
          {
            database !== null ? <Passwords database={database}/> : null
          }
        </div>
      </div>
    );
  }
}