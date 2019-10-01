import React from 'react';
import './login.css';
import { generateHash } from '../../utils/utils';

const Login: React.FC = () => {
  return (
    <div className="jsoncms-login">
      <div className="wrapper">
        <div className="form-signin">
          <h2 className="form-signin-heading">Please login</h2>
          <input type="text" className="form-control" name="username" placeholder="Username" required />
          <input type="password" className="form-control" name="password" placeholder="Password" required />
          <label className="checkbox">
            <input type="checkbox"/> Remember me
          </label>
          <button className="btn btn-lg btn-primary btn-block">Login</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
