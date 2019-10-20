import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TopBanner from '../general/TopBanner';
import { Typography, Fab } from '@material-ui/core';
import StandardGrid from '../general/StandardGrid';
import MemberStub from '../general/MemberStub';
import { mixins, constants } from '../../theme';
import LoadingModal from '../general/LoadingModal';
import CheckIcon from '@material-ui/icons/Check';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
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
        ...mixins.floatingCta,
        bottom: constants.footerArea + 35
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
            {/* <div className={classes.buttonArea}>
                <Button variant="contained" color="primary" onClick={rsvp}>RSVP</Button>
            </div> */}
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
            <Fab className={classes.floatingCta} color="primary" aria-label="Attend"  variant="extended" onClick={rsvp}>
                Attend?
            </Fab>
       </section>
    </article>)
}