import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NSP from './NSP';
import _ from 'underscore';
import ScrollTopMount from './ScrollTopMount';

const TEXTAREA_PLACEHOLDER = 'key,username,password\ngithub,john,bluegrass\nfacebook,john@x.com,bluegrass123';

export default class ImportData extends Component {
  static propTypes = {
    onImport: PropTypes.func.isRequired
  };
  static defaultProps = {};
  static contextTypes = {
    ...NSP.childContextTypes
  };

  handleSubmit = e => {
    e.preventDefault();

    this.doImport();
  };

  state = {
    csv: ''
  };

  changeCsv = ({ target: { value: csv } }) => this.setState({ csv });

  doImport = () => {
    const { csv } = this.state;
    const { onImport } = this.props;
    const { onError, onWarning, onSuccess } = this.context;

    const { data, errors, meta } = window.Papa.parse(csv, { header: true });

    if (!_.contains(meta.fields, 'key')) {
      onError('import must have a column labeled "key"');
      return;
    }

    if (errors.length > 0) {
      onError(
        _.map(
          errors,
          ({ code, message, row, type }) => `${typeof row === 'number' ? `On row ${row + 1}, ` : ''}${message}`
        ).join('; ')
      );
      return;
    }

    const treatedData = _.chain(data)
      .map(record => _.omit(record, value => typeof value !== 'string' || value.trim().length === 0))
      .filter(record => !_.isEmpty(record))
      .filter(record => typeof record.key === 'string' && record.key.trim().length > 0)
      .indexBy(record => record.key.trim())
      .mapObject(recordData => _.omit(recordData, 'key'))
      .value();

    if (_.keys(treatedData).length === 0) {
      onWarning('no rows could be imported!');
      return;
    }

    onSuccess(`imported data!`);

    onImport(treatedData);
  };

  render() {
    const { csv } = this.state;

    return (
      <div className="container-fluid">
        <ScrollTopMount/>

        <h2>Import Data</h2>
        <p className="lead">
          Use this form to import data from other password managers.
        </p>

        <ol>
          <li>Convert your data to the CSV format</li>
          <li>Specify the name of the entry in the first column</li>
          <li>Go!</li>
        </ol>


        <hr />

        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label>Paste CSV here</label>
            <textarea required value={csv} className="form-control" onChange={this.changeCsv}
                      style={{ height: 300 }}
                      placeholder={TEXTAREA_PLACEHOLDER}/>
          </div>

          <button type="submit" className="btn btn-primary">
            <i className="fa fa-cloud-upload"/> Import
          </button>
        </form>
      </div>
    );
  }
}