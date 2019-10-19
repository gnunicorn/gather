import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TopBanner from '../general/TopBanner';
import { Typography } from '@material-ui/core';
import StandardGrid from '../general/StandardGrid';
import MemberStub from '../general/MemberStub';
import { mixins } from '../../theme';

const useStyles = makeStyles(theme => ({
    root:{
        paddingBottom: "20px"
    },
    headings:{
        padding: "10px 15px",
        textAlign: "center"
    },
    memberSection:{
        padding: "10px 15px",
    },
    floatingCta:{
        ...mixins.floatingCta
    },
  }));
  
export default function ViewEvent(props) {
    const classes = useStyles();
    const {
        meta,
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
       <section className={classes.memberSection}>
            <Typography variant="h2" component="h2">
                Attendees    
            </Typography>
            <StandardGrid>
                {
                    members.map(member => 
                        (<MemberStub {...member}></MemberStub>)
                    )
                }
            </StandardGrid>
       </section>
    </article>)
}