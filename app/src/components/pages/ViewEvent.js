import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TopBanner from '../general/TopBanner';
import { Typography, Fab, Button } from '@material-ui/core';
import StandardGrid from '../general/StandardGrid';
import MemberStub from '../general/MemberStub';
import { mixins } from '../../theme';
import { Link } from "react-router-dom";
import EditIcon from '@material-ui/icons/Edit';
import LoadingModal from '../general/LoadingModal';

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
    buttonArea:{
        display:"flex",
        justifyContent: "center",
        flexWrap: "wrap",
        flexDirection: "row",
        "& > *":{
            margin: "10px 5px"
        }
    }
  }));
  
export default function ViewEvent(props) {
    const classes = useStyles();
    const {
        meta,
        members,
        rsvp,
        loading
    } = props;


    return (
    <article className={classes.root}>
        <LoadingModal loading={loading}></LoadingModal>
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
            <div className={classes.buttonArea}>
                <Button variant="contained" color="primary" onClick={rsvp}>RSVP</Button>
            </div>
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
             {/* {
                isAdmin === true && <Link className={classes.floatingCta} to={`/events/${meta.id}/new`}>
                <Fab color="primary">
                    <AddIcon />
                </Fab>
                </Link>
            } */}
            <Link className={classes.floatingCta} to={`/events/${meta.id}/edit`}>
                <Fab color="primary">
                    <EditIcon />
                </Fab>
            </Link>
       </section>
    </article>)
}