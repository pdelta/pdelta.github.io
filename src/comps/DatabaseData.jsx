import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { Link, Route } from 'react-router-dom';

export default class DatabaseData extends PureComponent {
  static contextTypes = {};
  static propTypes = {
    data: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  static defaultProps = {};

  render() {
    const { data } = this.props;
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
                    <Route key={store} path={store} children={({ match }) => (
                      <li key={store} role="presentation" className={match ? 'active' : ''}>
                        <Link to={store}>{store}</Link>
                      </li>
                    )}/>
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