import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "underscore";
import { ActiveLi } from "./ActiveLi";
import { Link, Route, Switch } from "react-router-dom";
import StoreForm from "./StoreForm";
import NSP from "./NSP";

export default class DatabaseData extends Component {
  static contextTypes = {
    ...NSP.childContextTypes
  };
  static propTypes = {
    database: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  static defaultProps = {};

  addStore = e => {
    e.preventDefault();
    const { newItemName } = this.state;
    const { data, onChange } = this.props;

    if (newItemName.trim().length>0) {
      if (data[ newItemName ]) {
        this.context.onError('item already exists!');
      } else {
        this.setState(
          { newItemName: '' },
          () => onChange({ ...data, [newItemName.trim()]: {} })
        );
      }
    } else {
      this.context.onError('item name is not valid');
    }
  };

  state = { newItemName: '' };

  render() {
    const { database: { owner: { login }, name }, data, onChange } = this.props;
    const { newItemName } = this.state;

    return (
      <div>
        <Switch>
          <Route path={`/db/${login}/${name}/:store`}
                 component={
                   ({ match: { params: { store } } }) => (
                     <div>
                       <Link to={`/db/${login}/${name}`}>Back</Link>
                       <hr/>
                       <StoreForm value={data[ store ] || {}} onChange={store => console.log(store)}/>
                     </div>
                   )
                 }/>

          <Route component={
            () => (
              <div>
                {(
                  _.keys(data).length > 0 ?
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
                )}

                <hr/>
                <form onSubmit={this.addStore} style={{ maxWidth: 300 }}>
                  <div className="form-group">
                    <label>Item Name</label>
                    <input className="form-control" type="text" value={newItemName}
                           onChange={({ target: { value: newItemName } }) => this.setState({ newItemName })}
                           placeholder="GitHub"/>
                  </div>

                  <button type="submit" className="btn btn-success">
                    <i className="fa fa-plus-circle"/> Add Item
                  </button>
                </form>
              </div>
            )
          }/>
        </Switch>
      </div>
    );
  }
}