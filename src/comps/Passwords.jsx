import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { getData } from '../dao';

export default class Passwords extends PureComponent {
  static contextTypes = {
    token: PropTypes.string.isRequired
  };
  static propTypes = {
    database: PropTypes.object.isRequired
  };
  static defaultProps = {};

  state = {
    data: null,
    password: '',
    promise: null
  };

  componentDidMount() {
    this.loadData(this.props.database);
  }

  componentWillReceiveProps({ database }) {
    if (this.props.database !== database) {
      this.loadData(database);
    }
  }

  loadData(database) {
    this.setState({
      password: '',
      data: null,
      promise: getData(this.context.token, database)
        .then(
          data => this.setState({ data, promise: null })
        )
        .catch(
          error => this.setState({ promise: null })
        )
    });
  }

  render() {
    const { data, password, } = this.state;

    return (
      <div>

      </div>
    );
  }
}