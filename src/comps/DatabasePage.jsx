import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getDatabase } from '../dao';
import Passwords from './Passwords';
import Spinner from './Spinner';
import _ from 'underscore';

export default class DatabasePage extends Component {
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
    this.loadDb(this.props.match.params);
  }

  componentWillReceiveProps({ match: { params: { owner, repo } } }) {
    if (!_.isEqual({ owner, repo }, this.props.match.params)) {
      this.loadDb({ owner, repo });
    }
  }

  loadDb = ({ owner, repo }) => {
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

    const { owner: { login }, html_url, name } = database;

    return (
      <div>
        <h1 className="page-header">
          <a href={html_url} target="_blank" rel="noopener noreferrer nofollow">{login}/{name}</a>
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