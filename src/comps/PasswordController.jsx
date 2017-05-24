import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getData, saveData } from '../util/dao';
import Spinner from './Spinner';
import { decodeData, encodeData, stretchKey } from '../util/crypt';
import DataRouter from './DataRouter';
import NSP from './NSP';
import PasswordForm from './PasswordForm';
import _ from 'underscore';
import { USER_SHAPE } from '../util/shapes';

const LAST_STRETCHED_PASS_KEY = 'last_stretched_password';

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
    stretchedPass: null,

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
        .then(data => {
          const stretchedPass = sessionStorage.getItem(LAST_STRETCHED_PASS_KEY);

          const decodedData = typeof stretchedPass === 'string' && stretchedPass.length > 0 ?
            decodeData(atob(data.content), stretchedPass) :
            null;

          this.setState({ data, decodedData, stretchedPass });
        })
        .catch(error => null)
        .then(() => this.setState({ promise: null }, this.focusPassword))
    });
  }

  focusPassword = () => {
    if (this.refs.passwordForm) {
      this.refs.passwordForm.focusPassword();
    }
  };

  tryPassword = _.throttle(() => {
    const { passwords: { password }, promise, data } = this.state;
    const { repository: { full_name } } = this.props;
    const { user: { token }, onInfo, onError, onSuccess } = this.context;

    if (promise !== null) {
      return;
    }

    const stretchedPass = stretchKey(password, full_name);

    if (data === null) {
      onInfo(`initializing db with password...`);

      const encryptedData = encodeData({}, stretchedPass);

      // create the data file
      this.setState({
        promise: saveData(token, full_name, { content: btoa(encryptedData) })
          .then(
            data => {
              onSuccess(`initialized!`);

              return getData(token, full_name);
            }
          )
          .then(data => this.setState({ data, decodedData: {}, stretchedPass }))
          .catch(onError)
          .then(() => this.setState({ promise: null }))
      });
    } else {
      const decodedData = decodeData(atob(data.content), stretchedPass);

      this.setState({ decodedData, stretchedPass }, () => {
        if (decodedData === null) {
          this.focusPassword();
          onError('invalid password');
        } else {
          sessionStorage.setItem(LAST_STRETCHED_PASS_KEY, stretchedPass);
          onSuccess('unlocked!');
        }
      });
    }
  }, 500);

  handleSubmit = e => {
    e.preventDefault();
    this.tryPassword();
  };

  handleChange = decodedData => this.setState({ decodedData }, this.throttledSync);

  syncToGit = () => {
    const { promise, data: { sha }, decodedData, stretchedPass } = this.state;
    const { user: { token }, onError, onInfo } = this.context;
    const { repository: { full_name } } = this.props;

    if (promise !== null) {
      return;
    }

    const encryptedData = encodeData(decodedData, stretchedPass);

    this.setState({
      promise: saveData(token, full_name, { sha, content: btoa(encryptedData) })
        .then(({ content: data }) => this.setState({ data }, () => onInfo(`synced to git`)))
        .catch(onError)
        .then(() => this.setState({ promise: null }))
    });
  };

  throttledSync = _.throttle(this.syncToGit, 300, { leading: false });

  changePasswords = passwords => this.setState({ passwords });

  render() {
    const { passwords, data, decodedData, promise } = this.state;

    if (decodedData !== null) {
      return (
        <DataRouter onChange={this.handleChange} decodedData={decodedData}/>
      );
    }

    if (promise !== null) {
      return <Spinner/>;
    }

    return (
      <div className="container">
        <h1 className="page-header">{data === null ? 'Set Password' : 'Enter Password'}</h1>
        <PasswordForm
          ref="passwordForm"
          onChange={this.changePasswords} value={passwords} onSubmit={this.handleSubmit}
          confirm={data === null}/>
      </div>
    );
  }
}