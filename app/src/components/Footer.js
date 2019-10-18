import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

import NodeInfo from "./NodeInfo";
import { Link } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  footerRoot: {
    padding: theme.spacing(2),
    backgroundColor: "#424242", // grey.A700,
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
        <Link>
          Menu 1
        </Link>
        <Link>
          Menu 2
        </Link>
      </nav>
      <article className={classes.nodeInfo}>
        <span>
          Node
        </span>
        {apiReady ? <NodeInfo api={api} /> : <CircularProgress color="inherit" />}
      </article>
    </section>
  </footer>)
}