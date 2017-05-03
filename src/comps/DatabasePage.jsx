import React, { PropTypes, PureComponent } from 'react';
import { deleteDatabase, getDatabases } from '../dao';
import _ from 'underscore';

export default class DatabasePage extends PureComponent {
  static contextTypes = {
    token: PropTypes.string.isRequired
  };
  static propTypes = {
    match: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired
  };
  static defaultProps = {};

  deleteDb = () => {
    const { match: { params: { id } } } = this.props;
    const { token } = this.context;

    if (confirm(`Delete database?`)) {
      getDatabases(token)
        .then(
          databases => _.findWhere(databases, { id: +id })
        )
        .then(
          database => deleteDatabase(token, database)
        )
        .then(
          () => alert('Deleted!')
        );
    }
  };

  render() {
    const { match: { params: { id } } } = this.props;

    return (
      <div>
        <h1 className="display-flex">
          <div className="flex-grow-1">{id}</div>
          <div className="flex-shrink-0">
            <i className="fa fa-trash text-danger" style={{ cursor: 'pointer' }} onClick={this.deleteDb}/>
          </div>
        </h1>
      </div>
    );
  }
}