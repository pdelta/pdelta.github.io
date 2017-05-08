import React, { Component } from 'react';
import Nav from './Nav';
import NSP from './NSP';

export default class AppShell extends Component {
  render() {
    return (
      <NSP>
        <div style={{ width: '100vw', height: '100vh' }}
             className="display-flex flex-direction-column">
          <div className="flex-shrink-0">
            <Nav/>
          </div>
          <div className="flex-grow-1 flex-shrink-1" style={{ overflow: 'auto' }}>
            <div className="container">
              {this.props.children}
            </div>
          </div>
        </div>
      </NSP>
    );
  }
}