import {
  Grid,
  Avatar,
  TextField,
  Button,
  Typography,
  Link,
  Paper,
  Box,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import axios from "axios";
import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { BrowserRouter } from "react-router-dom";
import { Copyright } from "../components/copyright";

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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = () => {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const postLogin = () => {
    if (email.length && password.length) {
      axios
        .post(`http://${window.location.host}/users/login`, {
          email: email,
          password: password,
        })
        .then((res) => res.data)
        .then((data) => {
          console.log("hu", data);
          if (data.status === 400) {
            console.log(data);
            window.alert(data.message);
          } else {
            if (remember) {
              localStorage.setItem("token", data.token);
              localStorage.setItem("user", data.user);
            } else {
              sessionStorage.setItem("token", data.token);
              sessionStorage.setItem("user", data.user);
            }

            if (data.user.isAdmin) {
              window.location.replace(
                `http://${window.location.host}/dashboard`
              );
            }
            if (data.user) {
              window.location.replace(
                `http://${window.location.host}/userPage`
              );
            }
          }
        })
        .catch((err) => {
          window.alert("some error occured please check console");
          console.log(err);
        });
    } else {
      window.alert("Email or Password too short");
    }
  };

  return (
    <BrowserRouter>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <div className={classes.form}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              margin="normal"
              autoFocus
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={remember}
                  color="primary"
                  onChange={() => {
                    setRemember(!remember);
                  }}
                />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={postLogin}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/forgotPassword" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </div>
        </Paper>
        <Box style={{ margin: 20 }}>
          <Copyright />
        </Box>
      </Container>
    </BrowserRouter>
  );
};

export default Login;
