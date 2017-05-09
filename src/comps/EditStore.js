import React, { Component } from 'react';
import StoreForm from './StoreForm';
import { Link } from 'react-router-dom';
import controllable from 'react-controllables';
import PropTypes from 'prop-types';

class EditStore extends Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired
  };

  render() {
    const { value, onChange, match: { params: { store } }, onSave } = this.props;

    return (
      <div className="container-fluid">
        <h1 className="page-header">{store}</h1>
        <StoreForm value={value} onChange={onChange}/>

        <hr />

        <div className="text-center">
          <Link className="btn btn-warning" style={{ marginRight: 10 }} to="/">
            <i className="fa fa-chevron-left"/> Cancel
          </Link>
          <button className="btn btn-success" onClick={e => onSave(value)}>
            <i className="fa fa-save"/> Save
          </button>
        </div>
      </div>
    );
  }
}

export default controllable(EditStore, [ 'value' ]);