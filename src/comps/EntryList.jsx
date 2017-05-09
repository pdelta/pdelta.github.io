import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { Link } from 'react-router-dom';

const firstChar = str => str.trim().toUpperCase()[ 0 ];

export default class EntryList extends Component {
  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.string).isRequired
  };

  render() {
    const { entries } = this.props;

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
                          <Link to={store}>{store}</Link>
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
