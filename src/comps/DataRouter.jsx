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

  handleAddEntry = entry => {
    this.handleChangeStore({ [entry.trim()]: {} });
  };

  EntryNav = props => <EntryNav onAddEntry={this.handleAddEntry} entries={_.keys(this.props.decodedData)} {...props}/>;
  StoreForm = props => <EditStore onSave={store => this.handleChangeStore({ [props.match.params.store]: store })}
                                  defaultValue={this.props.decodedData[ props.match.params.store ]} {...props}/>;

  render() {
    return (
      <Switch>
        <Route path="/" exact component={this.EntryNav}/>
        <Route path="/:store" component={this.StoreForm}/>
      </Switch>
    );
  }
}