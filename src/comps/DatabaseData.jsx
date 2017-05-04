import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "underscore";
import { ActiveLi } from "./ActiveLi";
import { Route, Switch } from "react-router-dom";
import StoreForm from "./StoreForm";


export default class DatabaseData extends Component {
  static contextTypes = {};
  static propTypes = {
    database: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  static defaultProps = {};

  render() {
    const { database: { owner: { login }, name }, data } = this.props;

    return (
      <div>
        <Switch>
          <Route path={`/db/${login}/${name}/:store`}
                 component={
                   ({ match: { params: { store } } }) => (
                     data[ store ] ?
                       <StoreForm value={store} onChange={store => console.log(store)}/>
                       :
                       <div className="alert alert-warning">
                         Invalid store!
                       </div>
                   )
                 }/>

          <Route component={({}) => (
            data.length > 0 ?
              <ul className="nav nav-pills">
                {
                  _.map(
                    data,
                    (storeData, store) => (
                      <ActiveLi key={store} to={`/db/${login}/${name}/${store}`}>{store}</ActiveLi>
                    )
                  )
                }
              </ul> :
              <div className="alert alert-info">No objects in this database!</div>
          )}/>
        </Switch>
      </div>
    );
  }
}