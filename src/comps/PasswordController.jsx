import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getData, saveData } from '../util/dao';
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
    promise: null,

    // this is the information about the repository data file
    data: null,

    // this is the decoded information from the data.content key
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
      // clear the state
      passwords: {},
      decodedData: null,
      data: null,

      // fetch the data
      promise: getData(token, repository.full_name)
        .then(data => this.setState({ data }))
        .catch(error => null)
        .then(() => this.setState({ promise: null }, this.focusPassword))
    });
  }

  focusPassword = () => this.refs.passwordForm.focusPassword();

  tryPassword = _.throttle(() => {
    const { passwords: { password }, promise, data } = this.state;
    const { repository: { full_name } } = this.props;
    const { user: { token }, onInfo, onError, onSuccess } = this.context;

    if (promise !== null) {
      return;
    }

    if (data === null) {
      onInfo(`initializing db with password...`);

      const encryptedData = encodeData({}, password, full_name);

      // create the data file
      this.setState({
        promise: saveData(token, full_name, { content: btoa(encryptedData) })
          .then(
            data => {
              onSuccess(`initialized!`);

              // we successfully initialized the data to an empty object
              this.setState({ data, decodedData: {} });
            }
          )
          .catch(onError)
          .then(() => this.setState({ promise: null }))
      });
    } else {
      const decodedData = decodeData(atob(data.content), password, full_name);

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

  saveChanges = decodedData => {
    const { promise, passwords: { password }, data: { sha } } = this.state;
    const { user: { token }, onInfo, onError, onSuccess } = this.context;
    const { repository: { full_name } } = this.props;

    if (promise !== null) {
      return;
    }

    const encryptedData = encodeData(decodedData, password, full_name);

    this.setState({
      decodedData,
      promise: saveData(token, full_name, { sha, content: btoa(encryptedData) })
        .then(({ content: data }) => this.setState({ data }, () => onSuccess(`saved!`)))
        .catch(onError)
        .then(() => this.setState({ promise: null }))
    });
  };

  changePasswords = passwords => this.setState({ passwords });

  render() {
    const { passwords, encryptedData, decodedData, promise } = this.state;

    if (decodedData !== null) {
      return (
        <DataRouter onChange={this.saveChanges} decodedData={decodedData}/>
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