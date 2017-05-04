import React, { PropTypes, PureComponent } from "react";
import _ from "underscore";

export default class StoreForm extends PureComponent {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object.isRequired
  };
  static defaultProps = {};

  handleChange = data => this.props.onChange({ ...this.props.value, ...data });
  addItem = () => this.handleChange({ item: 'test' });

  render() {
    const { value, ...rest } = this.props;

    return (
      <form {...rest}>
        {
          _.map(
            value,
            (data, key) => (
              <div className="form-group">
                <label>{key}</label>
                <input type="text" className="form-control" value={data}
                       onChange={() => this.handleChange({ [key]: data })}/>
              </div>
            )
          )
        }

        <button className="btn btn-primary" onClick={this.addItem}><i className="fa fa-plus"/> Add Data</button>
      </form>
    );
  }
}