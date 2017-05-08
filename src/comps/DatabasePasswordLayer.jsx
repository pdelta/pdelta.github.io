import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getData, saveData } from '../util/dao';
import Spinner from './Spinner';
import { decodeData, encodeData } from '../util/crypt';
import DatabaseData from './DatabaseData';
import NSP from './NSP';
import PasswordForm from './PasswordForm';
import _ from 'underscore';

// this component deals with fetching the data from the repository and allowing the user to enter a password to then
// view the decoded data
export default class DatabasePasswordLayer extends Component {
  static contextTypes = {
    user: PropTypes.string.isRequired,
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
    this.setState({
      passwords: {},
      decodedData: null,
      data: null,
      promise: getData(this.context.user.token, repository)
        .then(encryptedData => this.setState({ encryptedData, promise: null }, this.focusPassword))
        .catch(error => this.setState({ promise: null }, this.focusPassword))
    });
  }

  focusPassword = () => this.refs.passwordForm.focusPassword();

  tryPassword = _.throttle(() => {
    const { passwords: { password }, promise, encryptedData } = this.state;
    const { repository: { full_name } } = this.props;

    if (promise !== null) {
      return;
    }

    if (encryptedData === null) {
      this.context.onInfo(`initializing db with password...`);
      // create the data file
      this.setState({
        promise: saveData(this.context.user.token, this.props.repository, encodeData({}, password, full_name))
          .then(
            data => {
              this.context.onSuccess(`initialized!`);
              const decodedData = decodeData(data, password, full_name);

              this.setState({ promise: null, encryptedData, decodedData });
            }
          )
          .catch(
            error => {
              this.context.onError(error);
              this.setState({ promise: null });
            }
          )
      });
    } else {
      const decodedData = decodeData(encryptedData, password, full_name);
      this.setState({ decodedData }, () => {
        if (decodedData === null) {
          this.focusPassword();
          this.context.onError('invalid password');
        } else {
          this.context.onSuccess('unlocked!');
        }
      });
    }
  }, 500);

  handleSubmit = e => {
    e.preventDefault();
    this.tryPassword();
  };

  mergeChanges = decodedData => {
    this.setState({ decodedData });
  };

  changePasswords = passwords => this.setState({ passwords });

  render() {
    const { passwords, encryptedData, decodedData, promise } = this.state;
    const { repository } = this.props;

    if (decodedData !== null) {
      return (
        <DatabaseData data={decodedData} database={repository} onChange={this.mergeChanges}/>
      );
    }

    if (promise !== null) {
      return <Spinner/>;
    }

    return (
      <div>
        <h1 className="page-header">{encryptedData === null ? 'Set Password' : 'Enter Password'}</h1>
        <PasswordForm
          ref="passwordForm"
          onChange={this.changePasswords} value={passwords} onSubmit={this.handleSubmit}
          confirm={encryptedData === null}/>
      </div>
    );
  }
}