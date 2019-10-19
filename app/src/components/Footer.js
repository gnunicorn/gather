import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { Link } from "react-router-dom";
import NodeInfo from "./NodeInfo";

const useStyles = makeStyles(theme => ({
  footerRoot: {
    padding: theme.spacing(2),
    backgroundColor: grey.A700, 
    color: grey.A200,
    minHeight: 80,
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%"
  },
  footerInner:{
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: `0 ${theme.spacing(6)}px`,
    "& nav":{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      "& *":{
        marginRight: 5,
        color: grey.A200,
        cursor: "pointer"
      }
    }
  },
  nodeInfo:{
    "& span":{
      display: "block"
    }
  }
  }));
  
export default function Footer(props) {
  const classes = useStyles();
  const {apiReady, api} = props;

  return (<footer className={classes.footerRoot}>
    <section className={classes.footerInner}>
      <nav>
        <Link to="/">
          Home
        </Link>
        <Link to="/events">
          Events
        </Link>
        <Link to="/groups">
          Groups
        </Link>
      </nav>
      <article className={classes.nodeInfo}>
        {apiReady ? <NodeInfo api={api} /> : <CircularProgress color="inherit" />}
      </article>
    </section>
  </footer>)
}