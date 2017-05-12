import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppShell from './AppShell';
import { USER_SHAPE } from '../util/shapes';
import RepositoryController from './RepositoryController';

export default class App extends Component {
  static propTypes = {
    user: USER_SHAPE.isRequired
  };

  static childContextTypes = {
    user: USER_SHAPE
  };

  getChildContext() {
    return { user: this.props.user };
  }

  render() {
    return (
      <BrowserRouter>
        <AppShell>
          <RepositoryController/>
        </AppShell>
      </BrowserRouter>
    );
  }
}