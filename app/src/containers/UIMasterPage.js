
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
    root: {
        
    },
  }));

export default function UIMasterPage () {
    const classes = useStyles();

    return (
       <section className={classes.root}>
           <article>

           </article>
       </section>
    )
}