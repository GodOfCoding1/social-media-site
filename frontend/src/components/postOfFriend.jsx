import React, { useState } from "react";
import { Box, Button, Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

const PostOfFriend = ({ post, likePost, unlockPost, viewer }) => {
  const [alreadyLiked, setAlreadyLiked] = useState(false);
  const [locked, setLocked] = useState(post.coins_needed > 0 ? true : false);
  const dateOjb = new Date(post.time);

  const tryUnlock = async (id) => {
    if (
      window.confirm(
        "Do u want to pay ",
        post.coins_needed,
        " coins. ",
        "Current Balance : ",
        viewer.coins
      )
    )
      if (await unlockPost(id)) setLocked(false);
  };

  return (
    <React.Fragment>
      {post.type === "image" ? (
        <Paper
          style={{
            padding: "20px",
            marginTop: "20px",
            marginBottom: 0,
          }}
        >
          {" "}
          <Typography
            variant="caption"
            align="left"
            style={{ margin: 0, padding: 0, color: "#696969" }}
          >
            {post.username} at{" "}
            {dateOjb.getHours() +
              ":" +
              dateOjb.getMinutes() +
              " on " +
              dateOjb.getDate() +
              "/" +
              dateOjb.getMonth() +
              "/" +
              dateOjb.getFullYear()}
          </Typography>
          {locked && !post.unlocked_by?.includes(viewer._id) ? (
            <React.Fragment>
              <Paper
                style={{
                  backgroundColor: "rgb(166, 166, 166)",
                  padding: "20px",
                  marginTop: "20px",
                }}
              >
                {" "}
                <Typography
                  variant="h6"
                  color="textPrimary"
                  align="center"
                  style={{
                    margin: 0,
                    padding: 0,
                    color: "white",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    style={{
                      margin: 0,
                      padding: 0,
                      color: "white",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    Post Locked : {post.coins_needed}{" "}
                    <img
                      src="https://i.ibb.co/hYqQxM9/dollar-2.png"
                      alt="coin-icon"
                      width={25}
                      style={{ marginLeft: 6 }}
                    />
                  </Box>
                </Typography>
                <Typography
                  variant="h6"
                  color="textPrimary"
                  align="center"
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Button
                    variant="outlined"
                    style={{
                      color: "white",
                      border: "3px solid",
                    }}
                    onClick={() => {
                      tryUnlock(post._id);
                    }}
                  >
                    <LockOutlinedIcon style={{ marginRight: "6px" }} /> Unlock
                  </Button>
                </Typography>
              </Paper>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Typography
                variant="body1"
                color="textPrimary"
                align="left"
                style={{ margin: 0, padding: 0 }}
              >
                <img
                  src={post.image_url}
                  alt="post1"
                  width="100%"
                  style={{ margin: 0, padding: 0 }}
                />
              </Typography>
              {post.caption && (
                <Typography
                  variant="body1"
                  color="textPrimary"
                  align="left"
                  style={{ margin: 0, padding: 0 }}
                >
                  {post.caption}
                </Typography>
              )}
              <Typography
                variant="h6"
                color="textPrimary"
                align="left"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {!alreadyLiked && !post.liked_by?.includes(viewer._id) ? (
                    <FavoriteBorderIcon
                      style={{
                        marginRight: 13,
                        color: "rgb(151, 52, 175)",
                      }}
                    />
                  ) : (
                    <FavoriteIcon
                      style={{
                        marginRight: 13,
                        color: "rgb(151, 52, 175)",
                      }}
                    />
                  )}{" "}
                  {post.likes}
                </div>
                <Button
                  variant="contained"
                  style={
                    !alreadyLiked && !post.liked_by?.includes(viewer._id)
                      ? {
                          backgroundColor: "rgb(151, 52, 175)",
                          color: "white",
                          "&:hover": { backgroundColor: "rgb(137, 47, 158)" },
                        }
                      : {}
                  }
                  disabled={alreadyLiked || post.liked_by?.includes(viewer._id)}
                  onClick={() => {
                    likePost(post._id);
                    setAlreadyLiked(true);
                  }}
                >
                  <FavoriteBorderIcon />
                </Button>
              </Typography>
            </React.Fragment>
          )}
        </Paper>
      ) : post.type === "text" ? (
        <Paper
          style={{
            padding: "20px",
            marginTop: "20px",
            marginBottom: 0,
            backdropFilter: "blur(5px)",
          }}
        >
          <Typography
            variant="caption"
            align="left"
            style={{ margin: 0, padding: 0, color: "#696969" }}
          >
            {post.username} at{" "}
            {dateOjb.getHours() +
              ":" +
              dateOjb.getMinutes() +
              " on " +
              dateOjb.getDate() +
              "/" +
              dateOjb.getMonth() +
              "/" +
              dateOjb.getFullYear()}
          </Typography>
          {locked && !post.unlocked_by?.includes(viewer._id) ? (
            <React.Fragment>
              <Paper
                style={{
                  backgroundColor: "rgb(166, 166, 166)",
                  padding: "20px",
                  marginTop: "20px",
                }}
              >
                {" "}
                <Typography
                  variant="h6"
                  color="textPrimary"
                  align="center"
                  style={{
                    margin: 0,
                    padding: 0,
                    color: "white",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    style={{
                      margin: 0,
                      padding: 0,
                      color: "white",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    Post Locked : {post.coins_needed}{" "}
                    <img
                      src="https://i.ibb.co/hYqQxM9/dollar-2.png"
                      alt="coin-icon"
                      width={25}
                      style={{ marginLeft: 6 }}
                    />
                  </Box>
                </Typography>
                <Typography
                  variant="h6"
                  color="textPrimary"
                  align="center"
                  style={{
                    marginTop: 10,
                  }}
                >
                  <Button
                    variant="outlined"
                    style={{
                      color: "white",
                      border: "3px solid",
                    }}
                    onClick={() => {
                      tryUnlock(post._id);
                    }}
                  >
                    <LockOutlinedIcon style={{ marginRight: "6px" }} /> Unlock
                  </Button>
                </Typography>
              </Paper>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Typography
                variant="body1"
                color="textPrimary"
                align="left"
                style={{ margin: 0, padding: 0 }}
              >
                {post.text}
              </Typography>

              <Typography
                variant="h6"
                color="textPrimary"
                align="left"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {!alreadyLiked && !post.liked_by?.includes(viewer._id) ? (
                    <FavoriteBorderIcon
                      style={{
                        marginRight: 13,
                        color: "rgb(151, 52, 175)",
                      }}
                    />
                  ) : (
                    <FavoriteIcon
                      style={{
                        marginRight: 13,
                        color: "rgb(151, 52, 175)",
                      }}
                    />
                  )}{" "}
                  {post.likes}
                </div>
                <Button
                  variant="contained"
                  style={
                    !alreadyLiked && !post.liked_by?.includes(viewer._id)
                      ? {
                          backgroundColor: "rgb(151, 52, 175)",
                          color: "white",
                          "&:hover": { backgroundColor: "rgb(137, 47, 158)" },
                        }
                      : {}
                  }
                  disabled={alreadyLiked || post.liked_by?.includes(viewer._id)}
                  onClick={() => {
                    likePost(post._id);
                    setAlreadyLiked(true);
                  }}
                >
                  <FavoriteBorderIcon />
                </Button>
              </Typography>
            </React.Fragment>
          )}
        </Paper>
      ) : (
        false
      )}
    </React.Fragment>
  );
};

export default PostOfFriend;
