import React, { useState, useEffect, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { API_URL } from "../../../constants";
import { postData } from "../../../utils/apiRequests";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [inputErrors, setInputErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState();

  const history = useHistory();

  const handleLogin = async (e) => {
    e.preventDefault();
    let errors = [];

    if (!email) {
      errors.push("Email is missing");
    }

    if (!password) {
      errors.push("Password is missing");
    }

    errors.length > 0 && setInputErrors(errors);

    if (errors.length === 0) {
      postData(`/api/users/login`, {
        email,
        password,
      })
        .then((data) => {
          console.log(data);
          if (!data.success) {
            setInputErrors([data.message]);
          } else {
            setSuccessMessage(data.message);
            localStorage.setItem("authToken", data.authToken);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("authTokenExpiry", Date.now() + 10 * 60 * 60);
            history.push(`/`);
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const fetchProfile = useCallback(async () => {
    const res = await fetch(`/api/users/me`);
    const data = await res.json();

    if (!!data.success) {
      console.log(data.message);
      history.push(`/profile`);
    }
  }, [history]);

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="card col-6">
      {!!successMessage && (
        <div className="card text-bg-success">
          <div className="card-body">
            <p className="card-text">{successMessage}</p>
          </div>
        </div>
      )}
      {inputErrors.length > 0 && (
        <div className="card text-bg-warning">
          <div className="card-body">
            {inputErrors.map((error) => (
              <p className="card-text">{error}</p>
            ))}
          </div>
        </div>
      )}
      <form className="card-body row g-3" onSubmit={handleLogin}>
        <div className="col-md-12">
          <label for="inputEmail4" className="form-label">
            Email
          </label>
          <input
            name="email"
            type="email"
            className="form-control"
            id="inputEmail4"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="col-md-12">
          <label for="inputPassword4" className="form-label">
            Password
          </label>
          <input
            name="password"
            type="password"
            className="form-control"
            id="inputPassword4"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="pt-3 col-12">
          <button type="submit" className="btn btn-primary w-100">
            Log in
          </button>
        </div>
      </form>
      <button
        onClick={() => history.push(`/signup`)}
        className="mb-2 btn text-primary w-100"
      >
        Not signed up? Create an account here
      </button>
    </div>
  );
};

export default Login;
