import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Box, Paper } from "@material-ui/core";
import axios from "axios";
import React, { useState } from "react";
import { Copyright } from "../components/copyright";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import LinearProgress from "@material-ui/core/LinearProgress";

const validator = require("email-validator");

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "30px",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Register = () => {
  const classes = useStyles();

  const [name, setName] = useState("");
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [confrimPassword, setConfrimPassword] = useState("");
  const [email, setEmail] = useState("");

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

  const postRegister = () => {
    if (
      password.length >= 6 &&
      confrimPassword === password &&
      name.length > 2 &&
      username.length > 5 &&
      validator.validate(email)
    ) {
      axios
        .post(
          `http://localhost:5000/users/register`,
          {
            name: name,
            email: email,
            password: password,
            username: username,
          },
          options
        )
        .then((res) => {
          window.alert("Registered sucessfully");
          window.alert(res.data.message);

          if (res.data.status === 400) {
            if (res.data.message) {
              window.alert(res.data.message);
              window.location.reload();
            }
          } else {
            window.location.replace(`http://${window.location.host}/login`);
          }
        })
        .catch((err) => {
          window.alert("some error occured please check console");
          console.log(err);
        });
    } else {
      if (name.length < 2)
        window.alert("Name should contain more than 2 letters");
      if (username.length <= 5)
        window.alert("Username should contain more than 5 letters");
      if (!validator.validate(email)) window.alert("Enter a valid email");
      if (password.length < 6)
        window.alert("Password length should be more than 6");
      if (confrimPassword !== password) window.alert("Passwords don't match");
    }
  };

  return (
    <React.Fragment>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <div className={classes.form}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  autoComplete="name"
                  name="Name"
                  variant="outlined"
                  required
                  fullWidth
                  id="Name"
                  label="Full Name"
                  autoFocus
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="userName"
                  label="User Name"
                  name="userName"
                  autoComplete="username"
                  onChange={(event) => {
                    setusername(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="confrim password"
                  label="Confirm Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(event) => {
                    setConfrimPassword(event.target.value);
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={postRegister}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </div>
        </Paper>
        <Box style={{ margin: 20 }}>
          <Copyright />
        </Box>
      </Container>
      <Dialog
        onClose={() => {
          setShowBar(false);
        }}
        aria-labelledby="simple-dialog-title"
        open={showBar}
      >
        <DialogTitle id="simple-dialog-title">Registering...</DialogTitle>
        <LinearProgress variant="determinate" value={uploadPercentage} />
      </Dialog>
    </React.Fragment>
  );
};

export default Register;
