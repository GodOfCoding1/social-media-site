import NavBarUser from "../components/nav-bar/nav-bar-user";
import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import { CssBaseline } from "@material-ui/core";
import Requests from "../components/requests";
import AddPosts from "../components/addPost";
import ProfileOwner from "../components/profileOwner";

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
    }
  }, [token]);

  return (
    <BrowserRouter>
      <CssBaseline />
      <div style={{ height: "100vh", backgroundColor: "#f2f4f5" }}>
        <NavBarUser
          username={user.name}
          token={token}
          userData={user}
          active={location}
          setLocation={setLocation}
        />{" "}
        {location === "requests" ? (
          <Requests />
        ) : location === "post" ? (
          <AddPosts token={token} />
        ) : location === "profile" ? (
          <ProfileOwner token={token} />
        ) : (
          false
        )}
      </div>
    </BrowserRouter>
  );
};

export default UserPage;
