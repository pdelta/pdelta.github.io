import React, { PureComponent } from 'react';

export default class AddEntryForm extends PureComponent {
  static contextTypes = {};
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired
  };
  static defaultProps = {};

  render() {
    const { value = {}, onChange, ...rest } = this.props;
    const changed = data => onChange({ ...value, ...data });

    return (
      <form {...rest}>
        <div className="form-group">
          <label>Entry Name</label>
          <input className="form-control" type="text" value={value.name || ''}
                 onChange={({ target: { value: name } }) => changed({ name })}
                 placeholder="GitHub"/>
        </div>

        <button type="submit" className="btn btn-success">
          <i className="fa fa-plus-circle"/> Add Item
        </button>
      </form>
    );
  }
}