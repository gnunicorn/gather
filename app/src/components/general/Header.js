import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import logo from "../../assets/logo.svg";
import ReactSVG from 'react-svg'
import { Link } from "react-router-dom";
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    borderBottom: "2px solid #ccc",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color: grey.A400,
    textDecoration: "none"
  },
  toolBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    "& > *":{
      // Section general
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      "&:first-child":{
        // Left
        justifyContent: "flex-start",
        
      },
      "&:last-child":{
        // Right
        justifyContent: "flex-end",
      }
    }
  },
  logoWrapper: {
    display: "block",
    width: "100%",
    maxWidth: "25px",
    overflow: "hidden",
    marginRight: 15,
    "& > *": {
      objectFit: "contain"
    }
  },
  accountControl: {
    "& > *":{
      textDecoration: "none",
      marginLeft: "5px"
    }
  }
}));

export default function Header() {
  const classes = useStyles();

  return (
    <AppBar position="relative" color="inherit">
      <Toolbar className={classes.toolBar}>
        <section>
          <Link to="/" className={classes.logoWrapper}>
            <ReactSVG 
            src={logo} 
            beforeInjection={svg => {
              svg.setAttribute('style', 'width: 100%; height: 100%')
            }} 
            alt="Logo" />
          </Link>
          <Link to="/" className={classes.title}>
            <Typography variant="h6"  >
              Gather
            </Typography>
          </Link>
        </section>
        <section className={classes.accountControl}>
          <Link to="/login" underline="none">
            <Button variant="contained" color="primary">Login</Button>
          </Link>
          <Link to="/signup" underline="none">
            <Button variant="contained" color="primary">Signup</Button>
          </Link>
        </section>
      </Toolbar>
    </AppBar>
  );
}