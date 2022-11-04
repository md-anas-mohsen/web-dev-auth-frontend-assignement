import React, { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router-dom";
import { postData } from "../../../utils/apiRequests";

const Profile = () => {
  const [user, setUser] = useState();

  const history = useHistory();
  const fetchProfile = useCallback(async () => {
    const expiryTime = localStorage.getItem("authTokenExpiry");
    const refreshToken = localStorage.getItem("refreshToken");
    const authToken = localStorage.getItem("authToken");

    if (!!refreshToken && Date.now() > expiryTime) {
      postData(`/api/users/refresh-token`, {
        refreshToken,
      })
        .then((data) => {
          localStorage.setItem("authToken", data.authToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          localStorage.setItem("authTokenExpiry", Date.now() + 10 * 60 * 60);
          setUser(data.user);
        })
        .catch((err) => {
          console.error(err);
          history.push(`/login`);
        });
    } else {
      const res = await fetch(`/api/users/me`);
      const data = await res.json();

      if (!data.success) {
        console.log(data.message);
        history.push(`/login`);
      } else {
        setUser(data.user);
      }
    }
  }, [history]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    const res = await fetch(`/api/users/logout`, {
      method: "DELETE",
    });

    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authTokenExpiry");

    const data = await res.json();

    if (data.success) {
      history.push("/login");
    }
  };

  return (
    <div className="card col-6 p-4">
      {!!user && (
        <>
          <h1>Hello, {user.name}!</h1>
          <div className="col-md-12">
            <label for="inputPassword4" className="form-label">
              Name
            </label>
            <input className="form-control" disabled value={user.name} />
          </div>
          <div className="col-md-12">
            <label for="inputEmail4" className="form-label">
              Email
            </label>
            <input className="form-control" disabled value={user.email} />
          </div>

          <div className="pt-3 col-12">
            <button onClick={handleLogout} className="btn btn-danger w-100">
              Log out
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
