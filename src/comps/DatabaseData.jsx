import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import NSP from './NSP';
import EntryList from './EntryList';

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

export default class DatabaseData extends Component {
  static contextTypes = {
    ...NSP.childContextTypes
  };
  static propTypes = {
    database: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  static defaultProps = {};

  addStore = e => {
    e.preventDefault();
    const { newItemName } = this.state;
    const { data, onChange } = this.props;

    if (newItemName.trim().length > 0) {
      if (data[ newItemName ]) {
        this.context.onError('item already exists!');
      } else {
        this.setState(
          { newItemName: '' },
          () => onChange({ ...data, [newItemName.trim()]: {} })
        );
      }
    } else {
      this.context.onError('item name is not valid');
    }
  };

  state = {
    editingEntry: null,
    search: ''
  };

  changeSearch = ({ target: { value: search } }) => this.setState({ search });

  focusSearch = () => this.refs.search.focus();

  componentDidMount() {
    this.focusSearch();
  }

  handleEntrySelect = editingEntry => this.setState({ editingEntry });

  render() {
    const { data } = this.props,
      { search } = this.state;

    return (
      <div>
        <input type="search" ref="search" className="form-control" value={search} placeholder="Search"
               onChange={this.changeSearch}/>

        <hr />

        <div>
          {
            _.keys(data).length > 0 ?
              <EntryList data={_.omit(data, (data, key) => !keyMatches(key, search))}
                         onSelectEntry={this.handleEntrySelect}/> :
              <div className="alert alert-info">No objects in this database!</div>
          }
        </div>
      </div>
    );
  }
}