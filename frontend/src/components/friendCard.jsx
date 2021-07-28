import { Button, Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import SentimentDissatisfiedIcon from "@material-ui/icons/SentimentDissatisfied";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { DialogContent } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import PostOfFriend from "./postOfFriend";
const axios = require("axios");

const FriendCard = ({ friend, token, updateProps, viewer }) => {
  const [showPosts, setShowPosts] = useState(false);
  const [allPosts, setAllPosts] = useState([]);

  const likePost = (id) => {
    axios
      .get(`https://${window.location.host}/posts/likePost/${id}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        if (res.data.message) {
          window.alert(res.data.message);
        }
        getPosts(id);
      })
      .catch((err) => {
        window.alert("some error occured please check console");
        console.log(err);
      });
  };

  const unlockPost = async (id) => {
    return new Promise(async (resolve) => {
      try {
        const res = await axios.get(
          `https://${window.location.host}/posts/unlockPost/${id}`,
          {
            headers: {
              token: token,
            },
          }
        );
        if (res.data.message) {
          window.alert(res.data.message);
        }
        if (res.data.unlocked) resolve(true);
        resolve(false);
      } catch (error) {
        window.alert("some error occured please check console");
        console.log(error);
        resolve(false);
      }
    });
  };

  const getPosts = (id) => {
    axios
      .get(`https://${window.location.host}/posts/allposts/${id}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        if (res.data.message) {
          window.alert(res.data.message);
        }
        setAllPosts(res.data.posts);
        console.log(res.data.posts);
      })
      .catch((err) => {
        window.alert("some error occured please check console");
        console.log(err);
      });
  };

  const removeFriend = (id) => {
    if (window.confirm("Are you sure you want to unfriend?"))
      axios
        .get(`https://${window.location.host}/users/removeFriend/${id}`, {
          headers: {
            token: token,
          },
        })
        .then((res) => {
          if (res.data.message) {
            window.alert(res.data.message);
          }
          updateProps();
        })
        .catch((err) => {
          window.alert("some error occured please check console");
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
          {friend.dp_url ? (
            <img
              src={friend.dp_url}
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
                <b> Name:</b> {friend.name}
              </Typography>
              <Typography>
                <b> User Name: </b>
                {friend.username}
              </Typography>
            </div>
          </div>
        </div>
        <Typography align="center" style={{ paddingTop: "20px" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              getPosts(friend._id);
              setShowPosts(true);
            }}
            style={{ marginRight: "10px" }}
          >
            Veiw Posts
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              removeFriend(friend._id);
            }}
          >
            <SentimentDissatisfiedIcon style={{ marginRight: "10px" }} />
            UnFriend
          </Button>
        </Typography>
      </Paper>
      <Dialog
        onClose={() => {
          setShowPosts(false);
        }}
        aria-labelledby="customized-dialog-title"
        open={showPosts}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={() => {
            setShowPosts(false);
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div> {friend.username}</div>{" "}
            <CloseIcon
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                setShowPosts(false);
              }}
            />
          </div>
        </DialogTitle>
        <DialogContent dividers>
          {allPosts?.length ? (
            allPosts.map((post, index) => (
              <PostOfFriend
                key={index}
                post={post}
                likePost={likePost}
                unlockPost={unlockPost}
                viewer={viewer}
              />
            ))
          ) : (
            <Typography variant="body1" color="textPrimary" align="left">
              This person doesnt have any posts
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default FriendCard;
