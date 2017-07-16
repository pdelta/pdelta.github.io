import React, { Component } from 'react';
import { USER_SHAPE } from '../util/shapes';
import Spinner from './Spinner';
import { createRepository, getRepository } from '../util/dao';
import NSP from './NSP';
import PasswordController from './PasswordController';

const Welcome = ({ onStart }) => (
  <div className="container">
    <div className="jumbotron">
      <h1>Welcome</h1>
      <p>
        pdelta is a password manager based entirely on GitHub
      </p>
      <p>
        Looks like this is your first time
      </p>
      <p>
        Your data is stored in a private GitHub repository. 
        To use pdelta, you will need a GitHub subscription.
      </p>

      <button style={{ marginTop: 20 }} className="btn btn-primary btn-lg" onClick={onStart}>
        Get Started
      </button>
    </div>
  </div>
);

export default class RepositoryController extends Component {
  static contextTypes = {
    user: USER_SHAPE.isRequired,
    ...NSP.childContextTypes
  };
  static propTypes = {};
  static defaultProps = {};

  state = {
    repository: null,
    promise: null
  };

  componentDidMount() {
    this.loadRepository();
  }

  loadRepository() {
    const { user } = this.context, { promise } = this.state;

    if (promise !== null) {
      return;
    }

    this.setState({
      promise: getRepository(user.token, user.profile.login)
        .then(repository => this.setState({ repository }))
        .catch(error => this.context.onError)
        .then(() => this.setState({ promise: null }))
    });
  }

  start = () => {
    const { promise } = this.state,
      { user: { token }, onError } = this.context;

    if (promise !== null) {
      return;
    }


    this.setState({
      promise: createRepository(token)
        .then(repository => this.setState({ repository }))
        .catch(onError)
        .then(() => this.setState({ promise: null }))
    });
  };

  render() {
    const { promise, repository } = this.state;

    if (repository === null) {
      return promise !== null ? <Spinner/> : <Welcome onStart={this.start}/>;
    }

    return (
      <PasswordController repository={repository}/>
    );
  }
}