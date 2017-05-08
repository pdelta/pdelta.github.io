import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getEncryptedData, saveEncryptedData } from '../util/dao';
import Spinner from './Spinner';
import { decodeData, encodeData } from '../util/crypt';
import DataRouter from './DataRouter';
import NSP from './NSP';
import PasswordForm from './PasswordForm';
import _ from 'underscore';
import { USER_SHAPE } from '../util/shapes';

// this component deals with fetching the data from the repository and allowing the user to enter a password to then
// view the decoded data
export default class PasswordController extends Component {
  static contextTypes = {
    user: USER_SHAPE.isRequired,
    ...NSP.childContextTypes
  };

  static propTypes = {
    repository: PropTypes.object.isRequired
  };

  static defaultProps = {};

  state = {
    passwords: {},

    encryptedData: null,

    promise: null,
    decodedData: null
  };

  componentDidMount() {
    this.loadData(this.props.repository);
  }

  componentWillReceiveProps({ repository }) {
    if (this.props.repository.id !== repository.id) {
      this.loadData(repository);
    }
  }

  loadData(repository) {
    const { user: { token } } = this.context;

    this.setState({
      passwords: {},
      decodedData: null,
      data: null,
      promise: getEncryptedData(token, repository.full_name)
        .catch(error => null)
        .then(encryptedData => this.setState({ encryptedData, promise: null }, this.focusPassword))
    });
  }

  focusPassword = () => this.refs.passwordForm.focusPassword();

  tryPassword = _.throttle(() => {
    const { passwords: { password }, promise, encryptedData } = this.state;
    const { repository: { full_name } } = this.props;
    const { user: { token }, onInfo, onError, onSuccess } = this.context;

    if (promise !== null) {
      return;
    }

    if (encryptedData === null) {
      onInfo(`initializing db with password...`);

      const encryptedData = encodeData({}, password, full_name);

      // create the data file
      this.setState({
        promise: saveEncryptedData(token, full_name, encryptedData)
          .then(
            data => {
              onSuccess(`initialized!`);
              const decodedData = decodeData(data, password, full_name);

              this.setState({ encryptedData, decodedData });
            }
          )
          .catch(onError)
          .then(() => this.setState({ promise: null }))
      });
    } else {
      const decodedData = decodeData(encryptedData, password, full_name);
      this.setState({ decodedData }, () => {
        if (decodedData === null) {
          this.focusPassword();
          onError('invalid password');
        } else {
          onSuccess('unlocked!');
        }
      });
    }
  }, 500);

  handleSubmit = e => {
    e.preventDefault();
    this.tryPassword();
  };

  saveDecodedData = decodedData => {
    const { promise, passwords: { password } } = this.state;
    const { user: { token }, onInfo, onError, onSuccess } = this.context;
    const { repository: { full_name } } = this.props;

    if (promise !== null) {
      return;
    }

    const encryptedData = encodeData(decodedData, password, full_name);

    onInfo(`saving data...`);

    this.setState({
      decodedData,
      promise: saveEncryptedData(token, full_name, encryptedData)
        .then(
          () => onSuccess(`data saved!`)
        )
        .catch(onError)
        .then(
          () => this.setState({ promise: null, decodedData })
        )
    });
  };

  changePasswords = passwords => this.setState({ passwords });

  render() {
    const { passwords, encryptedData, decodedData, promise } = this.state;

    if (decodedData !== null) {
      return (
        <DataRouter onChange={this.saveDecodedData} decodedData={decodedData}/>
      );
    }

    if (promise !== null) {
      return <Spinner/>;
    }

    return (
      <div className="container">
        <h1 className="page-header">{encryptedData === null ? 'Set Password' : 'Enter Password'}</h1>
        <PasswordForm
          ref="passwordForm"
          onChange={this.changePasswords} value={passwords} onSubmit={this.handleSubmit}
          confirm={encryptedData === null}/>
      </div>
    );
  }
}