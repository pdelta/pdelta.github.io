import React, { Component } from 'react';
import Nav from './Nav';
import NSP from './NSP';
import GitHubForkRibbon from 'react-github-fork-ribbon';

export default class AppShell extends Component {
  render() {
    const { children } = this.props;

    return (
      <NSP>
        <GitHubForkRibbon target="_blank" position="left-bottom" href="https://github.com/pdelta/pdelta.github.io">
          Fork me on GitHub
        </GitHubForkRibbon>
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