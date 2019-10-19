import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TopBanner from '../general/TopBanner';
import { Typography, AppBar, Tabs, Tab } from '@material-ui/core';
import Slides from '../general/Slides';
import CardGrid from '../cards/CardGrid';
import CardBase from '../cards/CardBase';

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
    }
  }));
  
export default function ViewGroup(props) {
    const classes = useStyles();
    const {
        meta,
        events,
        members
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
                <CardGrid>
                    {
                        events.map(card => 
                            (<CardBase key={card.id} {...card}></CardBase>)
                        )
                    }
                </CardGrid>
           </div>
           <div className={classes.contentSlide}>
                <Typography variant="h2" component="h2">
                    Members    
                </Typography>
           </div>
       </Slides>
    </article>)
}