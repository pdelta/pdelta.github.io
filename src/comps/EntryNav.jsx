import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import EntryList from './EntryList';
import Alert from './Alert';
import * as qs from 'qs';

const keyMatches = (str, search) => {
  if (search.trim().toLowerCase().length === 0) {
    return true;
  }

  const ls = str.toLowerCase();

  return _.chain(search.split(' '))
    .map(s => s.toLowerCase().trim())
    .filter(s => s.length > 0)
    .all(s => ls.indexOf(s) !== -1)
    .value();
};

const cleanStr = str => str.trim().replace(/\s+/g, ' ');

export default class EntryNav extends Component {
  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.string).isRequired,
    history: PropTypes.object.isRequired
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyPresses);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyPresses);
  }

  focusSearch = () => this.refs.search.focus();

  updateSearch = search => this.props.history.push(`?search=${search}`);

  handleSearchChange = ({ target: { value: search } }) => this.updateSearch(search);

  handleKeyPresses = e => {
    const { keyCode, metaKey, ctrlKey } = e;

    switch (keyCode) {
      case 27:
        this.updateSearch('');
        this.focusSearch();
        break;

      default:
        if ((ctrlKey || metaKey) && keyCode === 70) {
          e.preventDefault();
          this.focusSearch();
        }
        break;
    }
  };

  render() {
    const { history, entries, location: { search: queryParams } } = this.props;
    const data = qs.parse(queryParams.substr(1)),
      search = data ? data.search || '' : '';

    const filteredEntries = search.trim().length === 0 ?
      entries :
      _.filter(entries, entry => keyMatches(entry, search));

    return (
      <div className="container-fluid">
        <form className="display-flex" onSubmit={e => {
          e.preventDefault();
          if (filteredEntries.length === 0) {
            history.push(search);
          } else if (filteredEntries.length === 1) {
            history.push(filteredEntries[ 0 ]);
          }
        }}>
          <div className="flex-grow-1">
            <input type="search" ref="search" className="form-control" required
                   value={search} placeholder="Search" onChange={this.handleSearchChange}/>
          </div>

          <div className="flex-shrink-0" style={{ marginLeft: 12 }}>
            <button type="submit" disabled={
              search.trim().length === 0
            } className="btn btn-primary">
              <i className="fa fa-search"/> Go
            </button>
          </div>
        </form>

        <hr />

        <div>
          {
            filteredEntries.length > 0 ?
              <EntryList entries={filteredEntries}/> :
              <Alert level="info">{entries.length > 0 ? 'No matching data!' : 'No data saved'}</Alert>
          }
        </div>
      </div>
    );
  }
}
