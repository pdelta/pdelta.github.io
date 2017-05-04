import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

export default class EntryList extends Component {
  static propTypes = {
    data: PropTypes.object,
    onSelectEntry: PropTypes.func.isRequired
  };

  render() {
    const { data, onSelectEntry } = this.props;

    const keys = _.sortBy(_.keys(data));

    return (
      <ul className="nav nav-pills">
        {
          _.map(
            keys,
            (store) => (
              <li key={store}>
                <a href="#" onClick={e => {
                  e.preventDefault();
                  onSelectEntry(store);
                }}>{store}</a>
              </li>
            )
          )
        }
      </ul>
    );
  }
}
