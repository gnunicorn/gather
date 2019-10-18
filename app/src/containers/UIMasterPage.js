
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import CardGrid from '../components/cards/CardGrid';
import CardBase from '../components/cards/CardBase';


const useStyles = makeStyles(theme => ({
    root: {
        
    },
  }));

const EventCardDummyData = [
    {
        title: "Diffusion 2019",
        subTitle: "19 Oct 2019 - 20 Oct 2019",
        type: "Event",
        link: "/event/diffusion-2019",
        image: null
    },
    {
        title: "Devcon 2020",
        subTitle: "?? ?? 2019 - ? ? 2020",
        type: "Event",
        link: "/event/devcon-2020",
        image: null
    }
]

const GroupCardDummyData = [
    {
        title: "Department of Decentralisation",
        subTitle: "Additional meta",
        type: "Group",
        link: "/group/department-of-decentralisation",
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
                        (<CardBase key={card.title} {...card}></CardBase>)
                    )
                }
            </CardGrid>
            <Typography variant="h3" component="h3">
                Groups
            </Typography>
            <CardGrid>
                {
                    GroupCardDummyData.map(card => 
                        (<CardBase key={card.title} {...card}></CardBase>)
                    )
                }
            </CardGrid>
           </article>
       </section>
    )
}