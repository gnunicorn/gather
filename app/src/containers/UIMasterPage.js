
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import StandardGrid from '../components/general/StandardGrid';
import CardBase from '../components/cards/CardBase';
import CreateEventContainer from './CreateEventContainer';
import CreateGroupContainer from './CreateGroupContainer';
import { EventCardDummyData, GroupCardDummyData } from '../dummyData';


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

            <Typography variant="h2" component="h2">
                Cards
            </Typography>
            <Typography variant="h3" component="h3">
                Events
            </Typography>
            <StandardGrid>
                {
                    EventCardDummyData.map(card => 
                        (<CardBase key={card.id} {...card}></CardBase>)
                    )
                }
            </StandardGrid>
            <Typography variant="h3" component="h3">
                Groups
            </Typography>
            <StandardGrid>
                {
                    GroupCardDummyData.map(card => 
                        (<CardBase key={card.id} {...card}></CardBase>)
                    )
                }
            </StandardGrid>

            <Typography variant="h2" component="h2">
                Create Event Form
            </Typography>
            <CreateEventContainer 
                onSubmit={(data)=>{console.log("Success", data)}}
                groupId="1234567i234234"
            ></CreateEventContainer>
             <Typography variant="h2" component="h2">
                Create Group Form
            </Typography>
            <CreateGroupContainer 
                onSubmit={(data)=>{console.log("Success", data)}}
            ></CreateGroupContainer>
           </article>
       </section>
    )
}