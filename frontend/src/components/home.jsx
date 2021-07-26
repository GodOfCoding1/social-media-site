import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { Button, Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

const axios = require("axios");

const useStyles = makeStyles((theme) => ({
  activeButtons: {
    backgroundColor: "rgb(151, 52, 175)",
    color: "white",
    "&:hover": { backgroundColor: "rgb(137, 47, 158)" },
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

const PostOfFriend = ({ post, likePost, viewer }) => {
  const [alreadyLiked, setAlreadyLiked] = useState(false);
  const dateOjb = new Date(post.time);

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
        </Paper>
      ) : post.type === "text" ? (
        <Paper
          style={{
            padding: "20px",
            marginTop: "20px",
            marginBottom: 0,
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
        </Paper>
      ) : (
        false
      )}
    </React.Fragment>
  );
};

const Home = ({ token, viewer }) => {
  const [feed, setFeed] = useState([]);

  const fetchFeed = () => {
    axios
      .get(`http://localhost:5000/posts/getFeed`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        if (res.data.message) window.alert(res.data.message);
        if (res.data.feed) setFeed(res.data.feed);
      })
      .catch((err) => {
        window.alert("Some error occured please check console");
        console.log(err);
      });
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const likePost = (id) => {
    axios
      .get(`http://localhost:5000/posts/likePost/${id}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        if (res.data.message) {
          window.alert(res.data.message);
          fetchFeed();
        }
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
        }}
      >
        <Typography variant="h5" color="textPrimary" align="left">
          <b> Your Feed </b>
        </Typography>
        {feed.length ? (
          feed.map((post, index) => (
            <PostOfFriend
              key={index}
              post={post}
              likePost={likePost}
              viewer={viewer}
            />
          ))
        ) : (
          <Typography variant="body1" color="textPrimary" align="left">
            Follow people and their posts will show up here
          </Typography>
        )}
      </Paper>
    </React.Fragment>
  );
};

export default Home;
