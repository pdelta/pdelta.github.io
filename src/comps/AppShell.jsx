import React, { Component } from 'react';
import Nav from './Nav';
import NSP from './NSP';

export default class AppShell extends Component {
  render() {
    const { children } = this.props;

    return (
      <NSP>
        <div>
          <Nav/>
          <div>
            {
              children
            }
          </div>
        </div>
      </NSP>
    );
  }
}