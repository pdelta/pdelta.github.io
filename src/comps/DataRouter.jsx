import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import NSP from './NSP';
import { Route, Switch } from 'react-router-dom';
import EntryNav from './EntryNav';

export default class DataRouter extends Component {
  static contextTypes = {
    ...NSP.childContextTypes
  };
  static propTypes = {
    decodedData: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };
  static defaultProps = {};

  handleChangeStore = store => {
    const { onChange, decodedData } = this.props;
    const { editingEntry } = this.state;

    if (!editingEntry) {
      return;
    }

    onChange({ ...decodedData, [editingEntry]: store });
  };

  render() {
    const { decodedData } = this.props;

    return (
      <Switch>
        <Route path="/" exact component={props => <EntryNav entries={_.keys(decodedData)} {...props}/>}/>
      </Switch>
    );
  }
}