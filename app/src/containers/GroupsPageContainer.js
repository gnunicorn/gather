import React, { useEffect, useState } from 'react';
import { Typography, Fab } from '@material-ui/core';
import StandardGrid from '../components/general/StandardGrid';
import CardBase from '../components/cards/CardBase';
import { makeStyles } from '@material-ui/core/styles';
import { mixins } from '../theme';
import { GroupCardDummyData } from '../dummyData';
import { Link } from "react-router-dom";

import AddIcon from '@material-ui/icons/Add';
import { getGroups } from '../services/gatherService';


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

    // TODO find way to get all ID's 
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            const data = await getGroups()
            setGroups(data);
            console.log(data)
        };
        fetchGroups();
      }, []);

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