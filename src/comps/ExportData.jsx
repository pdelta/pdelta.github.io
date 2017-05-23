import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

const select = ({ target }) => target.select();

export default class ExportData extends PureComponent {
  static propTypes = {
    decodedData: PropTypes.object.isRequired
  };
  static defaultProps = {};

  render() {
    const { decodedData } = this.props;

    const records = _.chain(decodedData).mapObject((value, key) => ({ ...value, key })).values().value();

    const fieldNameIndex = {};

    _.each(
      records,
      record => _.each(record, (value, key) => fieldNameIndex[ key ] = true)
    );

    const fields = [ 'key' ].concat(_.chain(fieldNameIndex).keys().sortBy().without('key').value());
    const data = _.map(
      records,
      record => _.map(fields, field => record[ field ] || '')
    );

    return (
      <div className="container-fluid">
        <h2>Export Data</h2>
        <p className="lead">Your CSV data is in the textarea below</p>

        <hr />

        <textarea readOnly className="form-control" style={{ height: 300 }}
                  value={window.Papa.unparse({ fields, data }, { header: true })} onFocus={select}
                  onClick={select}/>
      </div>
    );
  }
}