import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getData, saveData } from '../dao';
import Spinner from './Spinner';
import { decodeData, encodeData } from '../crypt';
import DatabaseData from './DatabaseData';

export default class Passwords extends Component {
  static contextTypes = {
    token: PropTypes.string.isRequired
  };
  static propTypes = {
    database: PropTypes.object.isRequired
  };
  static defaultProps = {};

  state = {
    password: '',
    confirmPassword: '',
    encryptedData: null,
    promise: null,
    decodedData: null
  };

  componentDidMount() {
    this.loadData(this.props.database);
  }

  componentWillReceiveProps({ database }) {
    if (this.props.database.id !== database.id) {
      this.loadData(database);
    }
  }

  loadData(database) {
    this.setState({
      password: '',
      decodedData: null,
      data: null,
      promise: getData(this.context.token, database)
        .then(
          encryptedData => this.setState({ encryptedData, promise: null }, () => this.refs.password.focus())
        )
        .catch(
          error => this.setState({ promise: null }, () => this.refs.password.focus())
        )
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { password, promise, encryptedData } = this.state;
    const { database: { full_name } } = this.props;

    if (promise !== null) {
      return;
    }

    if (encryptedData === null) {
      // create the data file
      this.setState({
        promise: saveData(this.context.token, this.props.database, encodeData({
          'My First Entry!': {
            username: 'hello',
            password: 'world'
          }
        }, password, full_name))
          .then(
            data => {
              const decodedData = decodeData(data, password, full_name);

              this.setState({ promise: null, encryptedData, decodedData });
            }
          )
      });
    } else {
      const decodedData = decodeData(encryptedData, password, full_name);
      this.setState({ decodedData }, () => {
        if (decodedData === null) {
          this.refs.password.focus();
        }
      });
    }
  };

  render() {
    const { password, confirmPassword, encryptedData, decodedData, promise } = this.state;

    if (decodedData !== null) {
      return <DatabaseData data={decodedData} database={this.props.database}/>;
    }

    if (promise !== null) {
      return <Spinner/>;
    }

    const isNew = encryptedData === null;

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="password">{isNew ? 'Set Password' : 'Enter Password'}</label>
            <input type="password" id="password" className="form-control" value={password}
                   placeholder="Password" ref="password"
                   onChange={({ target: { value: password } }) => this.setState({ password })}/>
          </div>

          {
            isNew ? (
              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input type="password" id="confirm-password" className="form-control" value={confirmPassword}
                       placeholder="Confirm Password"
                       onChange={({ target: { value: confirmPassword } }) => this.setState({ confirmPassword })}/>
              </div>
            ) : null
          }

          <button className="btn btn-primary" type="submit"
                  disabled={(isNew && password !== confirmPassword) || password.length < 1}>
            <i className="fa fa-key"/> Unlock
          </button>
        </form>
      </div>
    );
  }
}