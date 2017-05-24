import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import { Link } from 'react-router-dom';

export default class EntryList extends PureComponent {
  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.string).isRequired
  };

  render() {
    const { entries } = this.props;

    const groupedEntries = _.chain(entries)
      .groupBy(entry => entry.trim().toUpperCase()[ 0 ])
      .mapObject(charEntries => _.sortBy(charEntries, entry => entry.toLowerCase().trim()))
      .value();

    return (
      <div>
        {
          _.chain(groupedEntries)
            .keys()
            .sortBy()
            .map(
              firstChar => (
                <div key={firstChar}>
                  <h2>{firstChar}</h2>
                  <ul className="nav nav-pills">
                    {
                      _.map(
                        groupedEntries[ firstChar ],
                        store => (
                          <li key={store}>
                            <Link to={encodeURIComponent(store)}>{store}</Link>
                          </li>
                        )
                      )
                    }
                  </ul>
                </div>
              )
            )
            .value()
        }
      </div>
    );
  }
}