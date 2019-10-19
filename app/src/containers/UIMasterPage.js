
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import CardGrid from '../components/cards/CardGrid';
import CardBase from '../components/cards/CardBase';
import CreateEventContainer from './CreateEventContainer';
import CreateGroupContainer from './CreateGroupContainer';


const useStyles = makeStyles(theme => ({
    root: {
        
    },
  }));

const EventCardDummyData = [
    {
        id: "1234567io",
        title: "Diffusion 2019",
        subTitle: "19 Oct 2019 - 20 Oct 2019",
        type: "Event",
        link: "/events/diffusion-2019",
        image: null
    },
    {
        id: "1234567ip",
        title: "Devcon 2020",
        subTitle: "?? ?? 2019 - ? ? 2020",
        type: "Event",
        link: "/events/devcon-2020",
        image: null
    }
]

const GroupCardDummyData = [
    {
        id: "1234567i234234",
        title: "Department of Decentralisation",
        subTitle: "Additional meta",
        type: "Group",
        link: "/groups/department-of-decentralisation",
        image: null
    },
]

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
            <CardGrid>
                {
                    EventCardDummyData.map(card => 
                        (<CardBase key={card.id} {...card}></CardBase>)
                    )
                }
            </CardGrid>
            <Typography variant="h3" component="h3">
                Groups
            </Typography>
            <CardGrid>
                {
                    GroupCardDummyData.map(card => 
                        (<CardBase key={card.id} {...card}></CardBase>)
                    )
                }
            </CardGrid>

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