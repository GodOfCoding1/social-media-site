import { Button, Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import AddIcon from "@material-ui/icons/Add";
import React, { useEffect, useState } from "react";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import { makeStyles } from "@material-ui/core/styles";

const axios = require("axios");

const useStyles = makeStyles((theme) => ({
  paper: { padding: "20px", marginInline: "10px", marginTop: "10px" },
  activeButtons: {
    backgroundColor: "rgb(151, 52, 175)",
    color: "white",
    "&:hover": { backgroundColor: "rgb(137, 47, 158)" },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));

const UserCard = ({ user, id, token, viewer }) => {
  const classes = useStyles();
  const [user_data, setUser] = useState(user);

  useEffect(() => {
    if (id)
      axios
        .get(`http://localhost:5000/users/single_user_with_id/${id}`, {
          headers: {
            token: token,
          },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          window.alert("Some error occured please check console");
          console.log(err);
        });
  }, [id, token]);

  const sendRequest = (id_receiver) => {
    axios
      .get(`http://localhost:5000/users/sendRequest/${id_receiver}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        if (res.data.message) window.alert(res.data.message);
      })
      .catch((err) => {
        window.alert("Some error occured please check console");
        console.log(err);
      });
  };

  const acceptRequest = (id_receiver) => {
    axios
      .get(`http://localhost:5000/users/acceptRequest/${id_receiver}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        if (res.data.message) window.alert(res.data.message);
      })
      .catch((err) => {
        window.alert("Some error occured please check console");
        console.log(err);
      });
  };

  const rejectRequest = (id_receiver) => {
    axios
      .get(`http://localhost:5000/users/rejectRequest/${id_receiver}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        if (res.data.message) window.alert(res.data.message);
      })
      .catch((err) => {
        window.alert("Some error occured please check console");
        console.log(err);
      });
  };

  return (
    <React.Fragment>
      <Paper
        style={{
          padding: "20px",
          margin: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          {user_data.dp_url ? (
            <img
              src={user_data.dp_url}
              alt="dp"
              width="200px"
              style={{
                margin: 0,
                padding: 0,
                borderRadius: "5%",
                overflow: "hidden",
              }}
            />
          ) : (
            <img
              src="https://i.ibb.co/7NZX3Dg/user-1.png"
              alt="dp"
              width="100px"
              style={{
                marginInline: 20,
                padding: 0,
              }}
            />
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              width: "100%",
              alignItems: "center",
            }}
          >
            <div>
              <Typography>
                <b> Name:</b> {user_data.name}
              </Typography>
              <Typography>
                <b> User Name: </b>
                {user_data.username}
              </Typography>
            </div>
          </div>
        </div>
        {id ? (
          <Typography align="center" style={{ paddingTop: "20px" }}>
            <Button
              variant="contained"
              className={classes.activeButtons}
              disabled={viewer._id === user_data._id}
              onClick={() => {
                acceptRequest(user_data._id);
              }}
            >
              <AddIcon style={{ marginRight: "10px" }} />
              Accept
            </Button>
            <Button
              variant="contained"
              className={classes.activeButtons}
              disabled={viewer._id === user_data._id}
              onClick={() => {
                rejectRequest(user_data._id);
              }}
            >
              <ThumbDownIcon style={{ marginRight: "10px" }} />
              Reject
            </Button>
          </Typography>
        ) : (
          <Typography align="center" style={{ paddingTop: "20px" }}>
            <Button
              variant="contained"
              className={classes.activeButtons}
              disabled={
                viewer._id === user_data._id ||
                viewer.friends.includes(user_data._id)
              }
              onClick={() => {
                sendRequest(user_data._id);
              }}
            >
              <PersonAddOutlinedIcon style={{ marginRight: "10px" }} />
              send request
            </Button>
          </Typography>
        )}
      </Paper>
    </React.Fragment>
  );
};

export default UserCard;
