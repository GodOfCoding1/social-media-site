import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Paper } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import LinearProgress from "@material-ui/core/LinearProgress";
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

const CoinLock = ({ getCoin }) => {
  const [coin, setCoin] = useState("none");
  const [use, setUse] = useState(false);
  return (
    <React.Fragment>
      <Typography style={{ margin: 0, marginTop: "20px" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={use}
              onChange={() => {
                setUse(!use);
              }}
              name="checkedB"
              color="primary"
            />
          }
          label="Use CoinLock"
        />

        {use && (
          <Select
            value={coin}
            onChange={(e) => {
              setCoin(e.target.value);
              getCoin(e.target.value);
            }}
            style={{ marginInline: "10px" }}
          >
            <MenuItem value={"none"}>Select no. of coins</MenuItem>
            <MenuItem value={1}>1 coin</MenuItem>
            <MenuItem value={5}>5 coins</MenuItem>
            <MenuItem value={10}>10 coins</MenuItem>
          </Select>
        )}
      </Typography>
    </React.Fragment>
  );
};

const AddPosts = ({ token }) => {
  const classes = useStyles();
  const [type, setType] = useState("");
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [coins, setCoins] = useState(null);

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

  const axiosPost = async () => {
    let postData = {};

    setShowBar(true);

    if (file) {
      postData["type"] = "image";
      if (caption) postData["caption"] = caption;
      if (coins) postData["coins_needed"] = coins;
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
      postData["image_url"] = response.data.url;
    } else if (text) {
      postData["type"] = "text";
      postData["text"] = text;
      if (coins) postData["coins_needed"] = coins;
    } else {
      window.alert("Empty contents for post");
    }
    console.log("data being send to backend", postData);

    setShowBar(true);
    axios
      .post(`http://localhost:5000/posts/addPost`, postData, {
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
      })
      .catch((err) => {
        window.alert("some error occured please check console");
        console.log(err);
      });
  };

  // const sendUploadedFile = (file) => {
  //   const reader = new FileReader();
  //   reader.onload = (evt) => {
  //     /* get binary string */
  //     const bstr = evt.target.result;
  //     setFile(bstr);
  //   };

  //   reader.readAsBinaryString(file);
  // };

  const handleFileUpload = (e) => {
    if (e.target.files[0]) {
      //  sendUploadedFile(e.target.files[0]);
      setFile(e.target.files[0]);
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <Typography variant="h5" align="left">
          <b>Add a post</b>
        </Typography>
        <Typography
          component="div"
          variant="body1"
          color="textPrimary"
          align="left"
          style={{ marginTop: "15px" }}
        >
          Type of Post :
          <Select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
            }}
            style={{ marginInline: "5px" }}
          >
            <MenuItem value="picture">Picture</MenuItem>
            <MenuItem value="text">Tweet</MenuItem>
          </Select>
        </Typography>
        {type === "text" ? (
          <React.Fragment>
            <TextField
              placeholder="Type whats on your mind.."
              id="outlined-multiline-static"
              label="Tweet"
              multiline
              rows={4}
              variant="outlined"
              style={{ marginTop: "20px", width: "100%" }}
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
            <CoinLock getCoin={setCoins} />
          </React.Fragment>
        ) : type === "picture" ? (
          <React.Fragment>
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
              />
              Upload Picture
            </Button>

            {file && (
              <React.Fragment>
                <Typography style={{ marginTop: "20px" }}>
                  <img alt="uploaded" id="target" src={image} width="100%" />
                </Typography>
                <TextField
                  placeholder="Add a caption (optional)"
                  id="outlined-multiline-static"
                  label="Caption"
                  multiline
                  rows={2}
                  variant="outlined"
                  style={{ marginTop: "20px", width: "100%" }}
                  onChange={(e) => {
                    setCaption(e.target.value);
                  }}
                />{" "}
                <CoinLock getCoin={setCoins} />
              </React.Fragment>
            )}
          </React.Fragment>
        ) : (
          false
        )}

        {(file || text) && (
          <Typography align="right">
            <Button
              variant="contained"
              color="primary"
              // disabled={true}
              style={{ marginTop: "20px" }}
              className={classes.activeButtons}
              onClick={axiosPost}
            >
              Post
            </Button>
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

export default AddPosts;
