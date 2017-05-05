import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

const firstChar = str => str.trim()[ 0 ];

export default class EntryList extends Component {
  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectEntry: PropTypes.func.isRequired
  };

  render() {
    const { entries, onSelectEntry } = this.props;

    const groupedEntries = _.groupBy(entries, firstChar);

    return (
      <div>
        {
          _.map(
            groupedEntries,
            (group, firstChar) => (
              <div key={firstChar}>
                <h2>{firstChar}</h2>
                <ul className="nav nav-pills">
                  {
                    _.map(
                      group,
                      store => (
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
              </div>
            )
          )
        }
      </div>
    );
  }
}
