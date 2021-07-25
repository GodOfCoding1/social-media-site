import React, { useEffect, useState } from "react";
import { Button, Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import LinearProgress from "@material-ui/core/LinearProgress";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
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

const ProfileOwner = ({ token }) => {
  const classes = useStyles();
  const [allPosts, setAllPosts] = useState([]);
  const [user, setUser] = useState({});
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);

  //for progress bar
  const [showBar, setShowBar] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const options = {
    onUploadProgress: (progressEvent) => {
      const { loaded, total } = progressEvent;
      let percent = Math.floor((loaded * 100) / total);

      if (percent < 100) {
        setUploadPercentage(percent);
      }
      if (percent >= 100) {
        setShowBar(false);
      }
    },
  };

  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      //  sendUploadedFile(e.target.files[0]);
      setFile(e.target.files[0]);
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const axiosPostProfile = async () => {
    setShowBar(true);
    let postData = {};

    if (file) {
      //cloudinary
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "randomNameSoThatBadPeopleDontUpload123");
      data.append("cloud_name", "hibyehibye");
      let response;
      try {
        response = await axios.post(
          "https://api.cloudinary.com/v1_1/hibyehibye/image/upload",
          data,
          options
        );
      } catch (error) {
        console.log(error);
      }
      postData["dp_url"] = response.data.url;
    } else {
      window.alert("Empty contents for profile pic");
    }
    setShowBar(true);
    axios
      .post(`http://localhost:5000/users/uploadDP`, postData, {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percent = Math.floor((loaded * 100) / total);

          if (percent < 100) {
            setUploadPercentage(percent);
          }
          if (percent >= 100) {
            setShowBar(false);
          }
        },
        headers: {
          token: token,
        },
      })
      .then((res) => {
        if (res.data.message) {
          window.alert(res.data.message);
        }
        window.location.reload();
      })
      .catch((err) => {
        window.alert("Some error occured please check console");
        console.log(err);
      });
  };

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

  const deletePost = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete? You will still keep all the coins made on this post"
      )
    )
      axios
        .get(`http://localhost:5000/posts/deletePost/${id}`, {
          headers: {
            token: token,
          },
        })
        .then((res) => {
          if (res.data.message) {
            window.alert(res.data.message);
          }
          window.location.reload();
        })
        .catch((err) => {
          window.alert("some error occured please check console");
          console.log(err);
        });
  };

  return (
    <React.Fragment>
      {user.dp_url ? (
        <Paper
          style={{
            padding: "20px",
            margin: "20px",
            marginBottom: 0,
          }}
        >
          <Typography>
            <Button
              variant="contained"
              className={classes.activeButtons}
              component="label"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                hidden
              />
              Change Profile Picture
            </Button>
          </Typography>
          {file && (
            <React.Fragment>
              <Typography style={{ marginTop: "20px" }}>
                <img alt="uploaded" id="target" src={image} width="100%" />
              </Typography>
              <Button
                variant="contained"
                color="primary"
                // disabled={true}
                style={{ marginTop: "20px" }}
                className={classes.activeButtons}
                onClick={axiosPostProfile}
              >
                Change
              </Button>
            </React.Fragment>
          )}
        </Paper>
      ) : (
        <Paper
          style={{
            padding: "20px",
            margin: "20px",
            marginBottom: 0,
          }}
        >
          <Typography>
            <Button
              variant="contained"
              style={{ marginTop: "20px" }}
              className={classes.activeButtons}
              component="label"
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                hidden
              />{" "}
              Set Profile Picture
            </Button>
          </Typography>
          {file && (
            <React.Fragment>
              <Typography style={{ marginTop: "20px" }}>
                <img alt="uploaded" id="target" src={image} width="100%" />
              </Typography>
              <Button
                variant="contained"
                color="primary"
                // disabled={true}
                style={{ marginTop: "20px" }}
                className={classes.activeButtons}
                onClick={axiosPostProfile}
              >
                Set
              </Button>
            </React.Fragment>
          )}
        </Paper>
      )}
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
                <Typography align="right">
                  <Button
                    variant="contained"
                    onClick={() => {
                      deletePost(post._id);
                    }}
                  >
                    <DeleteOutlineIcon />
                  </Button>
                </Typography>
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
                <Typography align="right">
                  <Button
                    variant="contained"
                    onClick={() => {
                      deletePost(post._id);
                    }}
                  >
                    <DeleteOutlineIcon />
                  </Button>
                </Typography>
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
      <Dialog
        onClose={() => {
          setShowBar(false);
        }}
        aria-labelledby="simple-dialog-title"
        open={showBar}
      >
        <DialogTitle id="simple-dialog-title">Uploading...</DialogTitle>
        <LinearProgress variant="determinate" value={uploadPercentage} />
      </Dialog>
    </React.Fragment>
  );
};

export default ProfileOwner;
