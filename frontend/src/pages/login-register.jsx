import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Copyright } from "../components/copyright";

const About = () => {
  return (
    <React.Fragment>
      <Paper
        style={{
          padding: "20px",

          margin: "20px",
        }}
      >
        <Typography variant="h5" align="left">
          <b>ABOUT</b>
        </Typography>
        <Typography variant="body1" color="textPrimary" align="left">
          <li>This site has all the features of a social media site.</li>
          <li>This site has a coin system.</li>
          <li>Users can donate, exchange ,sell and buy these coins.</li>
        </Typography>
      </Paper>
      <Paper
        style={{
          padding: "20px",

          margin: "20px",
        }}
      >
        <Typography
          variant="h5"
          color="textPrimary"
          align="left
      "
        >
          <b>FEATURES</b>
        </Typography>
        <Typography variant="body1" color="textPrimary" align="left">
          <li>Follow requests</li>
          <li>Posts</li>
          <li>
            Hidden posts that can be seen only after certain ammount of coins
            are given.
          </li>
          <li>Like posts</li>
          <li>Likes on post award the owner coins</li> <li>Share posts</li>
        </Typography>
      </Paper>
      <Paper
        style={{
          padding: "20px",
          margin: "20px",
        }}
      >
        <Typography
          variant="h5"
          color="textPrimary"
          align="left
      "
        >
          <b>TECH</b>
        </Typography>
        <Typography variant="body1" color="textPrimary" align="left">
          <li>node.JS</li>
          <li>React.JS</li>
          <li>mongoDB</li>
        </Typography>
      </Paper>
      <Paper style={{ padding: "20px", margin: "20px" }}>
        <Typography
          variant="h5"
          color="textPrimary"
          align="left
      "
        >
          <b>Developer</b>
        </Typography>
        <Typography variant="body1" color="textPrimary" align="left">
          <li>
            GitHub: <a href="https://github.com/GodOfCoding1">GodOfCoding1</a>
          </li>
          <li>
            Source Code :{" "}
            <a href="https://github.com/GodOfCoding1/social-media-site">
              Click here
            </a>
          </li>
        </Typography>
      </Paper>
      <Paper style={{ padding: "20px", margin: "20px" }}>
        <Typography
          variant="h5"
          color="textPrimary"
          align="left
      "
        >
          <b>Resource used</b>
        </Typography>
        <Typography variant="body1" color="textPrimary" align="left">
          <li>
            Icons from{" "}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </li>
        </Typography>
        <Typography variant="body1" color="textPrimary" align="left">
          <li>
            Icons hosted on{" "}
            <a href="https://imgbb.com/" title="imgbb">
              imgbb
            </a>
          </li>
        </Typography>
        <Typography variant="body1" color="textPrimary" align="left">
          <li>
            Images hosted on{" "}
            <a href="https://cloudinary.com//" title="cloudinary">
              Cloudinary
            </a>
          </li>
        </Typography>
      </Paper>
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  "@global": {
    "*::-webkit-scrollbar": {
      width: "0.4em",
    },
    "*::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      outline: "none",
    },
  },
  root: {
    height: "100vh",
  },
  info: {
    // backgroundImage:
    //   "url(https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80)",
    // backgroundRepeat: "no-repeat",
    backgroundColor: theme.palette.grey[50],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  buttonGrid: {
    [theme.breakpoints.up("sm")]: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  paper: {
    width: "100%",
    padding: 40,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: 20,
  },
  login: {
    marginBottom: "20px",
    border: "3px solid",
  },
  register: {
    border: "3px solid",
  },
}));
const LoginRegister = () => {
  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={8} md={7} className={classes.info}>
        <Box
          style={{
            maxHeight: "100vh",
            overflow: "auto",
          }}
          component="span"
          display={{
            xs: "none",
            sm: "block",
            md: "block",
            lg: "block",
            xl: "block",
          }}
        >
          <About />
        </Box>
      </Grid>
      <Grid
        item
        xs={12}
        sm={4}
        md={5}
        className={classes.buttonGrid}
        component={Paper}
        square
      >
        <div className={classes.paper}>
          <img
            src="https://i.ibb.co/n8sC2Zc/image.png"
            alt="logo"
            border="0"
            width="300px"
            style={{
              borderRadius: "2%",
              overflow: "hidden",
              marginBottom: "20px",
            }}
          />
          <Button
            className={classes.login}
            variant="outlined"
            color="primary"
            href="/login"
            fullWidth={true}
          >
            Sign in
          </Button>
          <Button
            className={classes.register}
            variant="outlined"
            color="primary"
            href="/register"
            fullWidth={true}
          >
            Sign up
          </Button>

          <Box mt={2}>
            <Copyright />
          </Box>
        </div>
      </Grid>
      <Box component="span" display={{ xs: "block", sm: "none" }}>
        <About />
      </Box>
    </Grid>
  );
};

export default LoginRegister;
