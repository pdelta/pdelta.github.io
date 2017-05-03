import React, { PropTypes, PureComponent } from 'react';
import { createDatabase, deleteDatabase, getDatabases } from '../dao';
import _ from 'underscore';
import { Link } from 'react-router-dom';

const displayName = ({ name }) => name.substring('gitlock-db-'.length);

export default class GistList extends PureComponent {
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

    const { newDbName } = this.state;
    const { token } = this.context;

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

  deleteDb = database => {
    if (confirm(`Delete database: ${displayName(database)}`)) {
      this.setState({
        promise: deleteDatabase(this.context.token, database)
          .then(
            () => this.setState({ databases: _.without(this.state.databases, database), promise: null })
          )
      });
    }
  };

  render() {
    const { databases, promise, newDbName } = this.state;

    return (
      <div {...this.props}>
        {
          databases === null ? null :
            databases.length > 0 ?
              _.map(
                databases,
                database => (
                  <div key={database.id} className="display-flex">
                    <div className="flex-grow-1">
                      <Link to={`/db/${database.id}`}>{displayName(database)}</Link>
                    </div>
                    <div className="flex-shrink-0">
                      <i className="fa fa-trash text-danger" style={{ cursor: 'pointer' }}
                         onClick={e => this.deleteDb(database)}/>
                    </div>
                  </div>
                )
              ) :
              <div>No databases found!</div>
        }

        <hr />

        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Add Database</label>
            <div className="display-flex align-items-center">
              <div className="flex-grow-1">
                <input type="text" className="form-control" disabled={promise !== null} value={newDbName}
                       placeholder="Personal Passwords"
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