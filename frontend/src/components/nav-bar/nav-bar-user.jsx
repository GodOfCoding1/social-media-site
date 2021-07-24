import React from "react";
import { alpha, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import MoreIcon from "@material-ui/icons/MoreVert";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import PersonAddOutlinedIcon from "@material-ui/icons/PersonAddOutlined";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },

  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "20ch",
    },
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
  active: {
    color: "rgb(151, 52, 175)",
    border: "3px solid",
    "&:hover": {
      background: "rgb(151, 52, 175,0.1)",
    },
    paddingLeft: "10px",
    marginInline: "5px",
  },
  activeMobile: {
    display: "none",
  },
  passive: {
    color: "rgb(1, 158, 142)",
    border: "none",
    paddingLeft: "10px",
    "&:hover": {
      background: "rgb(1, 158, 142,0.1)",
    },
  },
}));

export default function NavBarUser({
  username,
  token,
  userData,
  active,
  setLocation,
}) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          setLocation("profile");
          handleMenuClose();
        }}
      >
        Profile
      </MenuItem>
      <MenuItem
        onClick={() => {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          window.location.replace(`http://${window.location.host}`);
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      className={classes.sectionMobile}
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem className={active === "home" ? classes.activeMobile : ""}>
        <Button
          variant="outlined"
          className={active === "home" ? classes.active : classes.passive}
          onClick={() => {
            setLocation("home");
          }}
        >
          <HomeOutlinedIcon style={{ marginRight: "6px" }} /> Home
        </Button>
      </MenuItem>
      <MenuItem className={active === "requests" ? classes.activeMobile : ""}>
        <Button
          variant="outlined"
          className={active === "requests" ? classes.active : classes.passive}
          onClick={() => {
            setLocation("requests");
          }}
        >
          <PersonAddOutlinedIcon style={{ marginRight: "6px" }} /> Requests
        </Button>
      </MenuItem>
      <MenuItem className={active === "profile" ? classes.activeMobile : ""}>
        <Button
          variant="outlined"
          className={active === "profile" ? classes.active : classes.passive}
          onClick={() => {
            setLocation("profile");
          }}
        >
          <AccountCircleOutlinedIcon style={{ marginRight: "6px" }} /> Profile
        </Button>
      </MenuItem>
      <MenuItem
        onClick={() => {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          window.location.replace(`http://${window.location.host}`);
        }}
      >
        <Button
          variant="outlined"
          className={active === "logout" ? classes.active : classes.passive}
        >
          <ExitToAppOutlinedIcon style={{ marginRight: "6px" }} />
          Logout
        </Button>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static" style={{ background: "white" }} elevation={2}>
        <Toolbar
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography className={classes.title} variant="h6" noWrap>
            <b style={{ color: "rgb(1, 158, 142)" }}> CoinFace</b>
          </Typography>

          <div className={classes.sectionDesktop}>
            <Button
              variant="outlined"
              className={active === "home" ? classes.active : classes.passive}
              onClick={() => {
                setLocation("home");
              }}
            >
              <HomeOutlinedIcon style={{ marginRight: "6px" }} /> Home
            </Button>

            <Button
              variant="outlined"
              className={active === "post" ? classes.active : classes.passive}
              onClick={() => {
                setLocation("post");
              }}
            >
              <AddIcon style={{ marginRight: "6px" }} /> Post
            </Button>

            <Button
              variant="outlined"
              className={
                active === "requests" ? classes.active : classes.passive
              }
              onClick={() => {
                setLocation("requests");
              }}
            >
              <PersonAddOutlinedIcon style={{ marginRight: "6px" }} /> Requests
            </Button>
          </div>

          <div className={classes.sectionDesktop}>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              style={{ color: "rgb(1, 158, 142)" }}
            >
              <AccountCircleOutlinedIcon />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            {" "}
            <Button
              variant="outlined"
              className={active === "post" ? classes.active : classes.passive}
              onClick={() => {
                setLocation("post");
              }}
            >
              <AddIcon style={{ marginRight: "6px" }} /> Post
            </Button>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              style={{ color: "rgb(1, 158, 142)" }}
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
