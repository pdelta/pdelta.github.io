import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class AddDatabaseForm extends PureComponent {
  static propTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    const { disabled, value = {}, onChange, ...rest } = this.props;

    return (
      <form {...rest}>
        <div className="form-group">
          <label>Add Database</label>
          <div className="display-flex align-items-center">
            <div className="flex-grow-1">
              <input type="text" className="form-control" disabled={disabled} value={value.name || ''}
                     placeholder="my-passwords"
                     onChange={({ target: { value: name } }) => onChange({ ...value, name })}/>
            </div>

            <div className="flex-shrink-0" style={{ marginLeft: 10 }}>
              <button className="btn btn-primary" type="submit" disabled={disabled}>
                <i className="fa fa-plus"/>
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}