import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useRef, useState } from "react";
import { Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import UserCard from "./userCard";
const axios = require("axios");

const useStyles = makeStyles((theme) => ({
  searchInput: {
    width: "100%",
    border: 0,
    fontSize: 16,
    "&:focus": {
      outline: "none",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

const Requests = ({ token, user_id, viewer }) => {
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchInput = useRef(null);

  useEffect(() => {
    console.log(search !== "");
    if (search !== "")
      axios
        .get(`http://localhost:5000/users/search/${search}`, {
          headers: {
            token: token,
          },
        })
        .then((res) => {
          if (res.data.message) {
            window.alert(res.data.message);
          }
          setSearchResults(res.data);
        })
        .catch((err) => {
          window.alert("Some error occured please check console");
          console.log(err);
        });
  }, [search, token]);

  return (
    <React.Fragment>
      {viewer.friend_request.length ? (
        <Paper
          style={{
            padding: "20px",
            margin: "20px",
          }}
        >
          <Typography variant="body1" color="textPrimary" align="left">
            <b> Pending requests</b>
          </Typography>
          {viewer.friend_request.map((possible_friend, index) => (
            <UserCard
              token={token}
              key={index + "requests"}
              id={possible_friend}
              viewer={viewer}
            />
          ))}
        </Paper>
      ) : (
        false
      )}
      <Paper
        style={{
          padding: "13px",
          margin: "20px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <div
          onClick={() => {
            searchInput.current.focus();
          }}
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <SearchIcon
            style={{ fontSize: 28, alignItems: "center", marginRight: 15 }}
          />
        </div>

        <input
          ref={searchInput}
          autoFocus
          variant="standard"
          className={classes.searchInput}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="Search for users..."
        />
      </Paper>
      {searchResults.length ? (
        searchResults.map((user, index) => (
          <UserCard token={token} key={index} user={user} viewer={viewer} />
        ))
      ) : (
        <Paper
          style={{
            padding: "20px",
            margin: "20px",
          }}
        >
          <Typography variant="body1" color="textPrimary" align="left">
            Search Algorithim is weak. Type atleast half of the name of the
            person you are looking for. Type exact username for most accurate
            results.
          </Typography>
        </Paper>
      )}
    </React.Fragment>
  );
};

export default Requests;
