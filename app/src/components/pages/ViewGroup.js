import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TopBanner from '../general/TopBanner';

const useStyles = makeStyles(theme => ({
    root:{

    },
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
        <TopBanner {...meta}>

        </TopBanner>
        
    </article>)
}