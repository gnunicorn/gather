import React from 'react';
import { Typography, Fab } from '@material-ui/core';
import StandardGrid from '../components/general/StandardGrid';
import CardBase from '../components/cards/CardBase';
import { makeStyles } from '@material-ui/core/styles';
import { mixins } from '../theme';
import { GroupCardDummyData } from '../dummyData';
import { Link } from "react-router-dom";

import AddIcon from '@material-ui/icons/Add';
const useStyles = makeStyles(theme => ({
    root: {
        ...mixins.standardContentWrapper
    },
    floatingCta:{
        ...mixins.floatingCta
    }
  }));

export default function GroupsPageContainer (props) {
    const classes = useStyles();

    return (
        <section className={classes.root}> 
            <Typography variant="h1" component="h1">
                Groups
            </Typography>
            <StandardGrid>
                {
                    GroupCardDummyData.map(card => 
                        (<CardBase key={card.id} {...card}></CardBase>)
                    )
                }
            </StandardGrid>
            <Link className={classes.floatingCta} to="/groups/new">
                <Fab color="primary">
                    <AddIcon />
                </Fab>
            </Link>
        </section>
    )
}