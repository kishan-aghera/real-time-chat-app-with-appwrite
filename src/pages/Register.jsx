import { useState } from "react";
import useAuth from "../utils/useAuth";
import { Link } from "react-router-dom";

const Register = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const {handleRegister} = useAuth()

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth--container">
      <div className="form--wrapper">
        <form
          onSubmit={(e) => {
            handleRegister(e, credentials);
          }}
        >
          <div className="field--wrapper">
            <label>Name:</label>
            <input
              required
              type="text"
              name="name"
              value={credentials.name}
              placeholder="Enter your name"
              onChange={(e) => {
                handleInputChange(e);
              }}
            />
          </div>

          <div className="field--wrapper">
            <label>Email:</label>
            <input
              required
              type="email"
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={(e) => {
                handleInputChange(e);
              }}
            />
          </div>

          <div className="field--wrapper">
            <label>Password:</label>
            <input
              required
              type="password"
              name="password"
              placeholder="Enter a password"
              value={credentials.password}
              onChange={(e) => {
                handleInputChange(e);
              }}
            />
          </div>

          <div className="field--wrapper">
            <label>Confirm password:</label>
            <input
              required
              type="password"
              name="confirm_password"
              placeholder="Comfirm your password"
              value={credentials.confirm_password}
              onChange={(e) => {
                handleInputChange(e);
              }}
            />
          </div>

          <div className="field--wrapper">
            <input
              className="btn btn--lg btn--main"
              type="submit"
              value="Register"
            />
          </div>
        </form>

        <p>
          Already have an account? Login <Link to="/login">here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
