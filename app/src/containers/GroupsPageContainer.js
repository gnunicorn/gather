import React from 'react';
import { Typography } from '@material-ui/core';
import CardGrid from '../components/cards/CardGrid';
import CardBase from '../components/cards/CardBase';
import { makeStyles } from '@material-ui/core/styles';
import { mixins } from '../theme';


const useStyles = makeStyles(theme => ({
    root: {
        ...mixins.standardContentWrapper
    },
  }));

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