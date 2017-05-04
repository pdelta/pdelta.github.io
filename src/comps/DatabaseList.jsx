import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createDatabase, getDatabases } from '../dao';
import _ from 'underscore';
import { Link, Route } from 'react-router-dom';

export default class DatabaseList extends Component {
  static contextTypes = {
    token: PropTypes.string.isRequired
  };
  static propTypes = {};
  static defaultProps = {};

  state = {
    promise: null,
    databases: null,
    newDbName: ''
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
          error => this.setState({ promise: null })
        )
    });
  }

  changeNewDbName = ({ target: { value: newDbName } }) => this.setState({ newDbName });
  handleSubmit = e => {
    e.preventDefault();

    const { newDbName, promise } = this.state;
    const { token } = this.context;

    if (promise !== null) {
      return;
    }

    this.setState({
      promise: createDatabase(token, { name: newDbName })
        .then(
          database => this.setState({
            promise: null,
            databases: this.state.databases.concat([ database ]),
            newDbName: ''
          })
        )
        .catch(error => this.setState({ promise: null }))
    });
  };

  render() {
    const { databases, promise, newDbName } = this.state;

    return (
      <div {...this.props}>
        {
          databases === null ? null :
            databases.length > 0 ?
              <ul className="nav nav-pills nav-stacked">
                {
                  _.map(
                    databases,
                    database => {
                      const path = `/db/${database.owner.login}/${database.name}`;
                      return (
                        <Route key={database.id} path={path}>
                          {
                            ({ match }) => (
                              <li role="presentation" className={match ? 'active' : ''}>
                                <Link to={path}>{database.owner.login}/{database.name}</Link>
                              </li>
                            )
                          }
                        </Route>
                      );
                    }
                  )
                }
              </ul> :
              <div className="alert alert-info">No database repositories found!</div>
        }

        <hr />

        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Add Database</label>
            <div className="display-flex align-items-center">
              <div className="flex-grow-1">
                <input type="text" className="form-control" disabled={promise !== null} value={newDbName}
                       placeholder="my-passwords"
                       onChange={this.changeNewDbName}/>
              </div>

              <div className="flex-shrink-0" style={{ marginLeft: 10 }}>
                <button className="btn btn-primary btn-sm" type="submit" disabled={promise !== null}>
                  <i className="fa fa-plus"/>
                </button>
              </div>
            </div>
          </div>
        </form>


      </div>
    );
  }
}