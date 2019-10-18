
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
    root: {
        
    },
  }));

export default function UIMasterPage () {
    const classes = useStyles();

    return (
       <section className={classes.root}>
           <Typography variant="h1" component="h1">
               UI master table
           </Typography>
           <article>

           </article>
       </section>
    )
}