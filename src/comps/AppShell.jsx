import React, { Component } from 'react';
import DatabaseList from './DatabaseList';
import Nav from './Nav';

export default class AppShell extends Component {
  render() {
    return (
      <div style={{ width: '100vw', height: '100vh' }}
           className="display-flex flex-direction-column">
        <div className="flex-shrink-0">
          <Nav/>
        </div>
        <div className="flex-grow-1 flex-shrink-1 sm-up-display-flex" style={{ overflow: 'hidden' }}>
          <div className="flex-shrink-0" style={{ padding: '20px 10px', boxShadow: '1px 0 1px 1px rgba(0,0,0,0.2)' }}>
            <DatabaseList/>
          </div>
          <div className="flex-grow-1 flex-shrink-1" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '0 20px' }}>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}