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
    history: PropTypes.object.isRequired,
    onAddEntry: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.focusSearch();
  }

  focusSearch = () => this.refs.search.focus();

  changeSearch = ({ target: { value: search } }) => {
    this.props.history.push(`?search=${search}`);
  };

  render() {
    const { onAddEntry, entries, location: { search: queryParams } } = this.props;
    const data = qs.parse(queryParams.substr(1)),
      search = data ? data.search || '' : '';

    const filteredEntries = search.trim().length === 0 ?
      entries :
      _.filter(entries, entry => keyMatches(entry, search));

    return (
      <div className="container-fluid">
        <form className="display-flex" onSubmit={e => {
          e.preventDefault();
          onAddEntry(search);
        }}>
          <div className="flex-grow-1">
            <input type="search" ref="search" className="form-control"
                   value={search} placeholder="Search" onChange={this.changeSearch}/>
          </div>

          <div className="flex-shrink-0" style={{ marginLeft: 12 }}>
            <button type="submit" disabled={
              search.trim().length === 0 || _.any(entries, entry => cleanStr(entry) === cleanStr(search))
            } className="btn btn-primary">
              <i className="fa fa-plus"/> Add
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
