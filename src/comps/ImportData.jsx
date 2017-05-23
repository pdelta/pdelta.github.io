import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NSP from './NSP';

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
    const { onError, onSuccess } = this.context;

    const lines = csv.split('\n');

    if (lines.length < 2) {
      onError(`no CSV import data entered!`);
      return;
    }
  };

  render() {
    const { csv } = this.state;

    return (
      <div className="container-fluid">
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
            <i className="fa fa-play"/> Import
          </button>
        </form>
      </div>
    );
  }
}