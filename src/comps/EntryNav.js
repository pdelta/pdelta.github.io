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

export default class EntryNav extends Component {
  static propTypes = {
    entries: PropTypes.arrayOf(PropTypes.string).isRequired,
    history: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.focusSearch();
  }

  focusSearch = () => this.refs.search.focus();

  changeSearch = ({ target: { value: search } }) => {
    this.props.history.push(`?search=${search}`);
  };

  handleSubmit = e => {
    e.preventDefault();
  };

  render() {
    const { entries, location: { search } } = this.props;
    const data = qs.parse(search.substr(1)),
      searchString = data ? data.search || '' : '';

    const filteredEntries = searchString.trim().length === 0 ?
      entries :
      _.filter(entries, entry => !keyMatches(entry, searchString));

    return (
      <div className="container-fluid">
        <form className="display-flex" onSubmit={this.handleSubmit}>
          <div className="flex-grow-1">
            <input type="search" ref="search" className="form-control"
                   value={data ? data.search || '' : ''}
                   placeholder="Search"
                   onChange={this.changeSearch}/>
          </div>

          <div className="flex-shrink-0" style={{ marginLeft: 12 }}>
            <button type="submit" disabled={false} className="btn btn-primary">
              <i className="fa fa-plus"/> Add
            </button>
          </div>
        </form>

        <hr />

        <div>
          {
            entries.length > 0 ?
              <EntryList entries={filteredEntries}/> :
              <Alert level="info">{entries.length > 0 ? 'No matching data!' : 'No data saved'}</Alert>
          }
        </div>
      </div>
    );
  }
}
