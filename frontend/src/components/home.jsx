import React, { useEffect, useState } from "react";
import { Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import PostOfFriend from "./postOfFriend";

const axios = require("axios");

const Home = ({ token, viewer }) => {
  const [feed, setFeed] = useState([]);

  const fetchFeed = () => {
    axios
      .get(`http://${window.location.host}/posts/getFeed`, {
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
    // eslint-disable-next-line
  }, []);

  const likePost = (id) => {
    axios
      .get(`http://${window.location.host}/posts/likePost/${id}`, {
        headers: {
          token: token,
        },
      })
      .then((res) => {
        if (res.data.message) {
          window.alert(res.data.message);
        }
        fetchFeed();
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
          `http://${window.location.host}/posts/unlockPost/${id}`,
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
        {feed?.length ? (
          feed.map((post, index) => (
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
            Follow people and their posts will show up here
          </Typography>
        )}
      </Paper>
    </React.Fragment>
  );
};

export default Home;
