import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    root: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
      transitionDuration: "400ms",
      margin: `${theme.spacing(4)}px 0`,
      "& > *":{
          padding: `${theme.spacing(2)}px`,
          marginBottom: 15
      }
    }
  
}));

export default function StandardGrid(props) {
  const {
    children
  } = props;
  const classes = useStyles();

  return (
    <section className={classes.root}>
        {children}
    </section>
  );
}