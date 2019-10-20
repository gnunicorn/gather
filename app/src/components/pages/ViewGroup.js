import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TopBanner from '../general/TopBanner';
import { Typography, AppBar, Tabs, Tab, Fab, Button } from '@material-ui/core';
import Slides from '../general/Slides';
import StandardGrid from '../general/StandardGrid';
import CardBase from '../cards/CardBase';
import MemberStub from '../general/MemberStub';
import { Link } from "react-router-dom";
import EditIcon from '@material-ui/icons/Edit';
import { mixins } from '../../theme';

const useStyles = makeStyles(theme => ({
    root:{
        paddingBottom: "20px"
    },
    headings:{
        padding: "10px 15px",
        textAlign: "center"
    },
    tabs:{

    },
    contentSlide:{
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
  
export default function ViewGroup(props) {
    const classes = useStyles();
    const {
        meta,
        events,
        members,
        joinGroup
    } = props;

    const [slideIndex, handleSlideChange] = useState(0);

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
        <div className={classes.buttonArea}>
           <Link to={`/events/${meta.id}/new`}>
                <Button variant="contained" color="primary" >
                    Create Event
                </Button>
            </Link>
            <Button variant="contained" color="primary" onClick={joinGroup}>
                Join Group
            </Button>
        </div>
        <AppBar position="static" className={classes.tabs}>
          <Tabs
            value={slideIndex}
            onChange={(data, value) => {
                handleSlideChange(value)
            }}
            variant="fullWidth" >
            <Tab label="EVENTS" />
            <Tab label="MEMBERS" />
          </Tabs>
        </AppBar>
       <Slides slideIndex={slideIndex}>
           <div className={classes.contentSlide}>
                <Typography variant="h2" component="h2">
                    Events    
                </Typography>
                <StandardGrid>
                    {
                        events.map(card => 
                            (<CardBase key={card.id} {...card}></CardBase>)
                        )
                    }
                </StandardGrid>
           </div>
           <div className={classes.contentSlide}>
                <Typography variant="h2" component="h2">
                    Members    
                </Typography>
                <StandardGrid>
                    {
                        members.map(member => 
                            (<MemberStub {...member}></MemberStub>)
                        )
                    }
                </StandardGrid>
           </div>
       </Slides>
       {/* 
            TODO: Wire up user state to correctly control this 
        */}
       {/* {
           isAdmin === true && <Link className={classes.floatingCta} to={`/events/${meta.id}/new`}>
           <Fab color="primary">
               <AddIcon />
           </Fab>
        </Link>
       } */}
       <Link className={classes.floatingCta} to={`/groups/${meta.id}/edit`}>
           <Fab color="primary">
               <EditIcon />
           </Fab>
        </Link>
    </article>)
}