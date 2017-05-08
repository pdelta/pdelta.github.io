import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import NSP from './NSP';
import EntryList from './EntryList';
import StoreForm from './StoreForm';
import Alert from './Alert';

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
    onChange: PropTypes.func.isRequired
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
  cancelEdit = () => {
    this.handleEntrySelect(null);
  };

  handleChangeStore = store => {
    const { onChange, data } = this.props;
    const { editingEntry } = this.state;

    if (!editingEntry) {
      return;
    }

    onChange({ ...data, [editingEntry]: store });
  };

  handleSubmitItem = e => {
    e.preventDefault();
    const { search } = this.state;
    const { data } = this.props;

    this.setState({ editingEntry: search });
  };

  render() {
    const { data } = this.props,
      { search, editingEntry } = this.state;

    const filteredData = _.omit(data, (data, key) => !keyMatches(key, search));

    if (editingEntry !== null) {
      return (
        <div className="container">
          <StoreForm value={data[ editingEntry ]} onChange={this.handleChangeStore}/>

          <hr />

          <div className="text-center">
            <button onClick={this.cancelEdit} className="btn btn-warning" style={{ marginRight: 10 }}>
              <i className="fa fa-chevron-left"/> Cancel
            </button>
            <button className="btn btn-success">
              <i className="fa fa-save"/> Save
            </button>
          </div>
        </div>
      );
    }

    // can only add if search length > 0 && none of the keys match the search
    const canAddSearch = search.trim().length > 0;

    return (
      <div className="container-fluid">
        <form className="display-flex" onSubmit={this.handleSubmitItem}>
          <div className="flex-grow-1">
            <input type="search" ref="search" className="form-control" value={search} placeholder="Search"
                   onChange={this.changeSearch}/>
          </div>
          <div className="flex-shrink-0" style={{ marginLeft: 12 }}>
            <button type="submit" disabled={!canAddSearch} className="btn btn-primary">Go</button>
          </div>
        </form>

        <hr />

        <div>
          {
            _.keys(filteredData).length > 0 ?
              <EntryList entries={_.keys(filteredData)} onSelectEntry={this.handleEntrySelect}/> :
              <Alert level="info">{_.keys(data).length > 0 ? 'No matching data!' : 'No data saved'}</Alert>
          }
        </div>
      </div>
    );
  }
}