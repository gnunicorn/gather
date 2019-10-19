import React from 'react';
import { Typography } from '@material-ui/core';
import CardGrid from '../components/cards/CardGrid';
import CardBase from '../components/cards/CardBase';
import { makeStyles } from '@material-ui/core/styles';
import { mixins } from '../theme';
import { GroupCardDummyData } from '../dummyData';


const useStyles = makeStyles(theme => ({
    root: {
        ...mixins.standardContentWrapper
    },
  }));

export default function GroupsPageContainer (props) {
    const classes = useStyles();

    return (
        <section className={classes.root}> 
            <Typography variant="h1" component="h1">
                Groups
            </Typography>
            <CardGrid>
                {
                    GroupCardDummyData.map(card => 
                        (<CardBase key={card.id} {...card}></CardBase>)
                    )
                }
            </CardGrid>
        </section>
    )
}