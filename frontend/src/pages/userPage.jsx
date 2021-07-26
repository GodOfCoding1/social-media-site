import NavBarUser from "../components/nav-bar/nav-bar-user";
import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { CssBaseline } from "@material-ui/core";
import Requests from "../components/requests";
import AddPosts from "../components/addPost";
import ProfileOwner from "../components/profileOwner";
import Home from "../components/home";

const axios = require("axios");
const UserPage = () => {
  const token = localStorage.getItem("token")
    ? localStorage.getItem("token")
    : sessionStorage.getItem("token");
  const [user, setUser] = useState({});
  const [location, setLocation] = useState("home");

  useEffect(() => {
    if (token) {
      axios
        .get(`http://localhost:5000/users/single_user`, {
          headers: {
            token: token,
          },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          window.alert("some error occured please check console");
          console.log(err);
        });
    } else {
      window.alert("You are not logged in");
      window.location.replace(`http://${window.location.host}/login`);
    }
  }, [token]);

  const updateProps = () => {
    if (token) {
      axios
        .get(`http://localhost:5000/users/single_user`, {
          headers: {
            token: token,
          },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          window.alert("some error occured please check console");
          console.log(err);
        });
    }
  };

  return (
    <BrowserRouter>
      <CssBaseline />
      <div style={{ height: "100vh", backgroundColor: "#f2f4f5" }}>
        <NavBarUser user={user} active={location} setLocation={setLocation} />{" "}
        <div style={{ paddingBottom: 20 }}>
          {location === "requests" ? (
            <Requests
              user={user}
              token={token}
              viewer={user}
              updateProps={updateProps}
            />
          ) : location === "post" ? (
            <AddPosts token={token} />
          ) : location === "profile" ? (
            <ProfileOwner token={token} />
          ) : location === "home" ? (
            <Home token={token} viewer={user} />
          ) : (
            false
          )}
        </div>
      </div>
    </BrowserRouter>
  );
};

export default UserPage;
