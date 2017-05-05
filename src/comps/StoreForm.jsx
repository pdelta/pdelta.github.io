import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

export default class StoreForm extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired
  };
  static defaultProps = {};

  handleChange = data => this.props.onChange({ ...this.props.value, ...data });

  state = { itemName: '' };
  changeItemName = ({ target: { value: itemName } }) => this.setState({ itemName });
  addItem = () => {
    const { itemName } = this.state;

    if (itemName.trim().length > 0 && !this.props.value[ itemName.trim() ]) {
      this.setState({ itemName: '' }, () => this.handleChange({ [itemName]: '' }));
    }
  };

  render() {
    const { value, onChange, ...rest } = this.props;
    const { itemName } = this.state;

    return (
      <form {...rest}>
        {
          _.map(
            value,
            (data, key) => (
              <div key={key} className="form-group">
                <label>{key}</label>
                <div className="display-flex">
                  <div className="flex-grow-1">
                    <input type="text" className="form-control" value={data}
                           placeholder={key}
                           onChange={({ target: { value: data } }) => this.handleChange({ [key]: data })}/>
                  </div>
                  <div style={{ marginLeft: 10 }}>
                    <button type="button" className="btn btn-danger"
                            onClick={() => this.handleChange(_.omit(value, key))}>
                      <i className="fa fa-trash"/> Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          )
        }

        <div className="display-flex">
          <div className="flex-grow-1">
            <input type="text" className="form-control" placeholder="Item Name" value={itemName}
                   onChange={this.changeItemName}/>
          </div>
          <div className="flex-shrink-0" style={{ marginLeft: 20 }}>
            <button type="button" className="btn btn-primary" onClick={this.addItem}>
              <i className="fa fa-list"/> Add Item
            </button>
          </div>
        </div>
      </form>
    );
  }
}