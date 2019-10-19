import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TopBanner from '../general/TopBanner';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root:{

    },
    headings:{
        padding: "10px 15px",
        textAlign: "center"
    }
  }));
  
export default function ViewGroup(props) {
    const classes = useStyles();
    console.log(props)
    const {
        meta,
        events,
        members
    } = props;

    return (
    <article className={classes.root}>
        <TopBanner {...meta}></TopBanner>
        <div className={classes.headings}>
            <Typography variant="h1" component="h1">
                {meta.title}
            </Typography>
            <Typography variant="h2" component="h2">
                {meta.subtitle}
            </Typography>
        </div>
    </article>)
}