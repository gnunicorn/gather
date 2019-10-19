import React from 'react';
import { Typography } from '@material-ui/core';
import StandardGrid from '../components/general/StandardGrid';
import CardBase from '../components/cards/CardBase';
import { makeStyles } from '@material-ui/core/styles';
import { mixins } from '../theme';
import { EventCardDummyData } from '../dummyData';


const useStyles = makeStyles(theme => ({
    root: {
        ...mixins.standardContentWrapper
    },
  }));

export default function EventsPageContainer (props) {
    const classes = useStyles();
    // TODO: use effect to fetch data
    return (
        <section className={classes.root}>
            <Typography variant="h1" component="h1">
                Events
            </Typography>
            <StandardGrid>
                {
                    EventCardDummyData.map(card => 
                        (<CardBase key={card.id} {...card}></CardBase>)
                    )
                }
            </StandardGrid>
        </section>
    )
}