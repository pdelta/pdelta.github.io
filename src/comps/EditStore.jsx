import React, { Component } from 'react';
import StoreForm from './StoreForm';
import { Link } from 'react-router-dom';
import controllable from 'react-controllables';
import PropTypes from 'prop-types';

class EditStore extends Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyPresses);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyPresses);
  }

  handleKeyPresses = e => {
    const { history } = this.props;

    // escape key
    if (e.keyCode === 27) {
      history.push('/');
    }
  };

  handleDelete = e => {
    const { onSave, history } = this.props;

    onSave(null);
    history.push('/');
  };

  render() {
    const { value, onChange, match: { params: { store } }, onSave } = this.props;

    return (
      <div ref="container" className="container-fluid">
        <h2 className="page-header">Edit: <em>{store}</em></h2>

        <StoreForm value={value} onChange={onChange}/>

        <hr />

        <div className="text-center">
          <Link className="btn btn-warning" style={{ margin: 6 }} to="/">
            <i className="fa fa-chevron-left"/> Cancel
          </Link>

          <button className="btn btn-danger" style={{ margin: 6 }} onClick={this.handleDelete}>
            <i className="fa fa-save"/> Delete
          </button>

          <button className="btn btn-success" style={{ margin: 6 }} onClick={e => onSave(value)}>
            <i className="fa fa-save"/> Save
          </button>
        </div>
      </div>
    );
  }
}

export default controllable(EditStore, [ 'value' ]);