import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import NSP from './NSP';
import StoreForm from './StoreForm';
import { Link, Route, Switch } from 'react-router-dom';
import EntryNav from './EntryNav';

export default class EditStore extends Component {
  render() {
    const { value, onChange } = this.props;

    return (
      <div className="container">
        <StoreForm value={value} onChange={onChange}/>

        <hr />

        <div className="text-center">
          <Link className="btn btn-warning" style={{ marginRight: 10 }} to="/">
            <i className="fa fa-chevron-left"/> Cancel
          </Link>
          <button className="btn btn-success">
            <i className="fa fa-save"/> Save
          </button>
        </div>
      </div>
    );
  }
}
