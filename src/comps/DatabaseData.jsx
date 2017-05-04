import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { ActiveLi } from './ActiveLi';

export default class DatabaseData extends Component {
  static contextTypes = {};
  static propTypes = {
    database: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  static defaultProps = {};

  render() {
    const { database: { owner: { login }, name }, data } = this.props;
    const stores = _.keys(data);

    return (
      <div>
        {
          stores.length > 0 ?
            <ul className="nav nav-pills">
              {
                _.map(
                  stores,
                  store => (
                    <ActiveLi key={store} to={`/db/${login}/${name}/${store}`}>{store}</ActiveLi>
                  )
                )
              }
            </ul> :
            <div className="alert alert-info">No objects in this database!</div>
        }
      </div>
    );
  }
}