import React, { Component } from 'react';
import './login.css';
import { generateHash } from '../../utils/utils';

interface UserState {
  username: string;
  password: string;
}

export const LoginView: React.FC<UserState> = (props) => {
  return (
    <div className="jsoncms-login">
      <div className="wrapper">
        <div className="form-signin">
          <h2 className="form-signin-heading">Please login</h2>
          <input type="text" className="form-control" name="username" placeholder="Username" value={props.username} required />
          <input type="password" className="form-control" name="password" placeholder="Password" value={props.password} required />
          <label className="checkbox">
            <input type="checkbox"/> Remember me
          </label>
          <button className="btn btn-lg btn-primary btn-block">Login</button>
        </div>
      </div>
    </div>
  );
}

class Login extends Component<{}, UserState> {
  state: UserState = {
    username: 'erfan',
    password: 'blub'
  }

  render() {
    return (
      <LoginView {...this.state}></LoginView>
    );
  }
}

export default Login;
