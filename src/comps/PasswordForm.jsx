import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import passwordStrength from '../util/password-strength';

const strToProgressBar = strength => {
  if (strength < 2) {
    return 'danger';
  } else if (strength < 5) {
    return 'warning';
  } else {
    return 'success';
  }
};

const strToErrorClass = strength => {
  if (strength < 2) {
    return 'error';
  } else if (strength < 5) {
    return 'warning';
  } else {
    return 'success';
  }
};

const PasswordStrengthMeter = ({ strength }) => (
  <div className="progress">
    <div className={cx('progress-bar', `progress-bar-${strToProgressBar(strength)}`)}
         style={{ width: `${strength / 6 * 100}%` }}/>
  </div>
);

export default class PasswordForm extends PureComponent {
  static contextTypes = {};
  static propTypes = {
    confirm: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.object
  };
  static defaultProps = {};

  focusPassword = () => this.refs.password.select();

  render() {
    const { confirm, onChange, value = {}, ...rest } = this.props;
    const { password = '', confirmPassword = '' } = value;
    const changed = data => onChange({ ...value, ...data });

    const strength = passwordStrength(password);

    return (
      <form {...rest}>
        <div className={cx('form-group', { [`has-${strToErrorClass(strength)}`]: password.length > 0 })}>
          <label htmlFor="password">{confirm ? 'Set Password' : 'Enter Password'}</label>
          <input type="password" id="password" className="form-control" value={password}
                 placeholder="Password" ref="password" required
                 onChange={({ target: { value: password } }) => changed({ password })}/>

          {
            confirm ? (
              <div style={{ marginTop: 4 }}>
                <PasswordStrengthMeter strength={strength}/>
              </div>
            ) : null
          }
        </div>

        {
          confirm ? (
            <div
              className={cx('form-group', { 'has-error': confirmPassword.length > 0 && confirmPassword !== password })}>
              <label htmlFor="confirm-password">Confirm Password</label>
              <input type="password" id="confirm-password" className="form-control" value={confirmPassword}
                     placeholder="Confirm Password" required
                     onChange={({ target: { value: confirmPassword } }) => changed({ confirmPassword })}/>
            </div>
          ) : null
        }

        <button className="btn btn-primary" type="submit"
                disabled={(confirm && password !== confirmPassword) || password.length < 1}>
          <i className="fa fa-key"/> Unlock
        </button>
      </form>
    );
  }
}