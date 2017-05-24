import React, { Component } from 'react';
import StoreForm from './StoreForm';
import { Link } from 'react-router-dom';
import controllable from 'react-controllables';
import PropTypes from 'prop-types';
import ScrollTopMount from './ScrollTopMount';

class EditStore extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyPresses);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyPresses);
  }

  handleKeyPresses = e => {
    const { history } = this.props;

    const { keyCode, metaKey, ctrlKey } = e;

    if (keyCode === 27) {
      e.preventDefault();
      history.push('/');
    } else if (keyCode === 46 || keyCode === 8) {
      if (metaKey || ctrlKey) {
        e.preventDefault();
        this.handleDelete();
      }
    }
  };

  handleDelete = () => {
    const { onChange, name } = this.props;

    if (window.prompt(`Type to delete: ${name}`) === name) {
      onChange(null);
    }
  };

  render() {
    const { name, value, onChange } = this.props;

    return (
      <div className="container-fluid">
        <ScrollTopMount/>

        <h2 className="page-header">Edit: <em>{name}</em></h2>

        <StoreForm value={value} onChange={onChange}/>

        <hr />

        <div className="text-center">
          <Link className="btn btn-warning" style={{ margin: 6 }} to="/">
            <i className="fa fa-arrow-left"/> Back
          </Link>

          <button className="btn btn-danger" style={{ margin: 6 }} onClick={this.handleDelete}>
            <i className="fa fa-save"/> Delete
          </button>
        </div>
      </div>
    );
  }
}

export default controllable(EditStore, [ 'value' ]);