import React, { useEffect, useState } from 'react';
import { Typography, Fab } from '@material-ui/core';
import StandardGrid from '../components/general/StandardGrid';
import CardBase from '../components/cards/CardBase';
import { makeStyles } from '@material-ui/core/styles';
import { mixins } from '../theme';
import { getGroups } from '../services/gatherService';
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

    // TODO find way to get all ID's 
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            const data = await getGroups()
            setGroups(data);
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
                    groups.map(card => 
                        (<CardBase key={card.id} linkPrefix="/groups" {...card}></CardBase>)
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