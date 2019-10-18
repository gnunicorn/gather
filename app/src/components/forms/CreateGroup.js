import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import logo from "../assets/logo.svg";
import ReactSVG from 'react-svg'

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
  }
}));

export default function CreateGroup() {
  const classes = useStyles();

  return (
    <Form>
      <Field type="email" name="email" />
      <ErrorMessage name="email" component="div" />
      <Field type="password" name="password" />
      <ErrorMessage name="password" component="div" />
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </Form>
  );
}