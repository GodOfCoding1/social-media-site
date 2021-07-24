import React, { useEffect, useState } from "react";
import { Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
const axios = require("axios");

const ProfileOwner = ({ token }) => {
  const [allPosts, setAllPosts] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    //get user
    axios
      .get(`http://localhost:5000/users/single_user`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        if (res.data.message) {
          window.alert(res.data.message);
        }
        setUser(res.data);
      })
      .catch((err) => {
        window.alert("Some error occured please check console");
        console.log(err);
      });
    //get all posts
    axios
      .get(`http://localhost:5000/posts/allposts/:id`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        if (res.data.message) {
          window.alert(res.data.message);
        }
        setAllPosts(res.data.posts);
      })
      .catch((err) => {
        window.alert("some error occured please check console");
        console.log(err);
      });
  }, [token]);

  return (
    <React.Fragment>
      <Paper
        style={{
          padding: "20px",
          margin: "20px",
          marginBottom: 0,
        }}
      >
        <Typography variant="h5" align="left">
          <b>Coins in Account </b>
        </Typography>
        <Typography
          variant="h4"
          color="textPrimary"
          align="left"
          style={{ margin: 0, padding: 0 }}
        >
          <img
            src="https://i.ibb.co/hYqQxM9/dollar-2.png"
            alt="coin-icon"
            width={27}
          />{" "}
          {user.coins}
        </Typography>
      </Paper>
      <Paper
        style={{
          padding: "20px",
          margin: "20px",
        }}
      >
        <Typography variant="h5" align="left">
          <b>Your Posts</b>
        </Typography>
        {allPosts.length ? (
          allPosts.map((post, index) =>
            post.type === "image" ? (
              <Paper
                key={index}
                style={{
                  padding: "20px",
                  margin: "20px",
                  marginBottom: 0,
                }}
              >
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
                <Typography variant="body1" color="textPrimary" align="left">
                  <b>Likes :</b> {post.likes}
                </Typography>
                {post.coins_needed > 0 ? (
                  <Typography variant="body1" color="textPrimary" align="left">
                    <b>Coins Earned :</b>
                    {post.coins_earned}
                  </Typography>
                ) : (
                  <Typography variant="body1" color="textPrimary" align="left">
                    CoinLock was not used
                  </Typography>
                )}
              </Paper>
            ) : post.type === "text" ? (
              <Paper
                key={index}
                style={{
                  padding: "20px",
                  margin: "20px",
                  marginBottom: 0,
                }}
              >
                <Typography
                  variant="body1"
                  color="textPrimary"
                  align="left"
                  style={{ margin: 0, padding: 0 }}
                >
                  {post.text}
                </Typography>

                <Typography variant="body1" color="textPrimary" align="left">
                  <b>Likes :</b> {post.likes}
                </Typography>
                {post.coins_needed > 0 ? (
                  <Typography variant="body1" color="textPrimary" align="left">
                    <b>Coins Earned :</b>
                    {post.coins_earned}
                  </Typography>
                ) : (
                  <Typography variant="body1" color="textPrimary" align="left">
                    CoinLock was not used
                  </Typography>
                )}
              </Paper>
            ) : (
              false
            )
          )
        ) : (
          <Typography variant="body1" color="textPrimary" align="left">
            You dont have any posts
          </Typography>
        )}
      </Paper>
    </React.Fragment>
  );
};

export default ProfileOwner;
