import React, { PropTypes, PureComponent } from 'react';

export default class LoginInfo extends PureComponent {
  static contextTypes = {
    token: PropTypes.string.isRequired
  };
  static propTypes = {};
  static defaultProps = {};

  state = {
    profile: null
  };

  componentDidMount() {
    const { token } = this.context;

    fetch(
      'https://api.github.com/user',
      {
        headers: {
          'Authorization': `token ${token}`
        }
      })
      .then(res => res.json())
      .then(profile => this.setState({ profile }));
  }

  render() {
    const { profile } = this.state;

    if (profile === null) {
      return null;
    }

    const { avatar_url, login, name, html_url } = profile;

    return (
      <div className="display-flex align-items-center" {...this.props}>
        <div style={{ marginRight: 8 }}>
          <img alt="github avatar" className="img-circle" style={{ width: '2em', height: '2em' }} src={avatar_url}/>
        </div>
        <div>
          <div>{name}</div>
          <div>
            <a href={html_url} target="_blank" rel="noopener noreferrer nofollow">
              <small>{login}</small>
            </a>
          </div>
        </div>
      </div>
    );
  }
}