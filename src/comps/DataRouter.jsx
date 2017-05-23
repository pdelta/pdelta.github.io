import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import NSP from './NSP';
import { Link, Route, Switch } from 'react-router-dom';
import EntryNav from './EntryNav';
import EditStore from './EditStore';
import ImportData from './ImportData';
import ExportData from './ExportData';
import cx from 'classnames';

const NavLink = ({ to, exact, ...rest }) => (
  <Route
    path={to}
    exact={exact}
    children={
      ({ match }) => (
        <li role="presentation" className={cx({ active: match !== null })}><Link to={to} {...rest}/></li>
      )
    }/>
);

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

    onChange(_.omit({ ...decodedData, ...more }, value => value === null));
  };

  handleAddEntry = entry => this.handleChangeStore({ [entry.trim()]: {} });
  handleImport = data => this.handleChangeStore(data);

  render() {
    const { decodedData } = this.props;

    return (
      <div style={{ marginBottom: 20 }}>
        <div className="container-fluid" style={{ marginBottom: 20 }}>
          <ul className="nav nav-tabs">
            <NavLink exact to="/">Database</NavLink>
            <NavLink exact to="/import">Import</NavLink>
            <NavLink exact to="/export">Export</NavLink>
          </ul>
        </div>

        <Switch>
          <Route
            path="/" exact
            render={props => <EntryNav onAddEntry={this.handleAddEntry} entries={_.keys(decodedData)} {...props}/>}/>
          <Route
            path="/import" exact
            render={props => <ImportData onImport={this.handleImport}/>}
          />
          <Route
            path="/export" exact
            render={props => <ExportData decodedData={decodedData}/>}
          />
          <Route
            path="/:store"
            render={props => <EditStore onSave={store => this.handleChangeStore({ [props.match.params.store]: store })}
                                        defaultValue={decodedData[ props.match.params.store ] || {}} {...props}/>}/>
        </Switch>
      </div>
    );
  }
}