import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import NSP from './NSP';
import { Route, Switch } from 'react-router-dom';
import EntryNav from './EntryNav';
import EditStore from './EditStore';

export default class DataRouter extends Component {
  static contextTypes = {
    ...NSP.childContextTypes
  };
  static propTypes = {
    decodedData: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };
  static defaultProps = {};

  handleChangeStore = more => {
    const { onChange, decodedData } = this.props;

    onChange({ ...decodedData, ...more });
  };

  handleAddEntry = entry => this.handleChangeStore({ [entry.trim()]: {} });

  render() {
    const { decodedData } = this.props;

    return (
      <Switch>
        <Route
          path="/" exact
          render={props => <EntryNav onAddEntry={this.handleAddEntry} entries={_.keys(decodedData)} {...props}/>}/>
        <Route
          path="/:store"
          render={props => <EditStore onSave={store => this.handleChangeStore({ [props.match.params.store]: store })}
                                      defaultValue={decodedData[ props.match.params.store ]} {...props}/>}/>
      </Switch>
    );
  }
}