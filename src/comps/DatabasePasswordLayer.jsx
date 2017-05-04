import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getData, saveData } from '../util/dao';
import Spinner from './Spinner';
import { decodeData, encodeData } from '../util/crypt';
import DatabaseData from './DatabaseData';
import NSP from './NSP';
import PasswordForm from './PasswordForm';

// this component deals with fetching the data from the repository and allowing the user to enter a password to then
// view the decoded data
export default class DatabasePasswordLayer extends Component {
  static contextTypes = {
    token: PropTypes.string.isRequired,
    ...NSP.childContextTypes
  };

  static propTypes = {
    database: PropTypes.object.isRequired
  };

  static defaultProps = {};

  state = {
    passwords: {},

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
      passwords: {},
      decodedData: null,
      data: null,
      promise: getData(this.context.token, database)
        .then(encryptedData => this.setState({ encryptedData, promise: null }, this.focusPassword))
        .catch(error => this.setState({ promise: null }, this.focusPassword))
    });
  }

  focusPassword = () => this.refs.passwordForm.focusPassword();

  handleSubmit = e => {
    e.preventDefault();
    const { passwords: { password }, promise, encryptedData } = this.state;
    const { database: { full_name } } = this.props;

    if (promise !== null) {
      return;
    }

    if (encryptedData === null) {
      this.context.onInfo(`initializing db with password...`);
      // create the data file
      this.setState({
        promise: saveData(this.context.token, this.props.database, encodeData({}, password, full_name))
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
          this.refs.password.select();
          this.context.onError('invalid password');
        } else {
          this.context.onSuccess('success!');
        }
      });
    }
  };

  mergeChanges = decodedData => {
    this.setState({ decodedData });
  };

  changePasswords = passwords => this.setState({ passwords });

  render() {
    const { passwords, encryptedData, decodedData, promise } = this.state;
    const { database } = this.props;

    if (decodedData !== null) {
      return (
        <DatabaseData data={decodedData} database={database} onChange={this.mergeChanges}/>
      );
    }

    if (promise !== null) {
      return <Spinner/>;
    }

    return (
      <PasswordForm
        ref="passwordForm"
        onChange={this.changePasswords} value={passwords} onSubmit={this.handleSubmit}
        confirm={encryptedData === null}/>
    );
  }
}