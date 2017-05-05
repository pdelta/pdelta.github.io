import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

export default class EntryList extends Component {
  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectEntry: PropTypes.func.isRequired
  };

  render() {
    const { entries, onSelectEntry } = this.props;

    return (
      <ul className="nav nav-pills">
        {
          _.map(
            entries,
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
