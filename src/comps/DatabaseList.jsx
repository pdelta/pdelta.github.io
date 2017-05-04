import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createDatabase, getDatabases } from '../util/dao';
import _ from 'underscore';
import { ActiveLi } from './ActiveLi';
import NSP from './NSP';
import AddDatabaseForm from './AddDatabaseForm';

export default class DatabaseList extends Component {
  static contextTypes = {
    token: PropTypes.string.isRequired,
    ...NSP.childContextTypes
  };
  static propTypes = {};
  static defaultProps = {};

  state = {
    promise: null,
    databases: null,
    newDatabase: {}
  };

  componentDidMount() {
    this.loadDatabases();
  }

  loadDatabases() {
    const { token } = this.context;

    this.setState({
      promise: getDatabases(token)
        .then(
          databases => this.setState({ promise: null, databases })
        )
        .catch(
          error => {
            this.setState({ promise: null });
            this.context.onError(error);
          }
        )
    });
  }

  handleSubmit = e => {
    e.preventDefault();

    const { newDatabase, promise } = this.state;
    const { token } = this.context;

    if (promise !== null) {
      return;
    }

    this.setState({
      promise: createDatabase(token, newDatabase)
        .then(
          database => {
            this.context.onSuccess(`created database: ${database.name}`);
            this.setState({
              promise: null,
              databases: this.state.databases.concat([ database ]),
              newDatabase: {}
            });
          }
        )
        .catch(error => {
          this.setState({ promise: null });
          this.context.onError(error);
        })
    });
  };

  handleNewDatabaseChange = newDatabase => this.setState({ newDatabase });

  render() {
    const { databases, promise, newDatabase } = this.state;

    return (
      <div {...this.props}>
        {
          databases === null ? null :
            databases.length > 0 ?
              <ul className="nav nav-pills nav-stacked">
                {
                  _.map(
                    databases,
                    database => (
                      <ActiveLi key={database.id} role="presentation"
                                to={`/db/${database.owner.login}/${database.name}`}>
                        {database.owner.login}/{database.name}
                      </ActiveLi>
                    )
                  )
                }
              </ul> :
              <div className="alert alert-info">No database repositories found!</div>
        }

        <hr />

        <AddDatabaseForm value={newDatabase} onChange={this.handleNewDatabaseChange} disabled={promise !== null}
                         onSubmit={this.handleSubmit}/>
      </div>
    );
  }
}