import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { ActiveLi } from './ActiveLi';
import { Route } from 'react-router-dom';


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

        <Route path={`/db/${login}/${name}/:store`}
               component={({ match: { params: { store } } }) => <span>{store}</span>}/>
      </div>
    );
  }
}