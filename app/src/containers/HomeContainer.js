
import React, { Fragment, useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { constants } from '../theme';
import { GroupCardDummyData, EventCardDummyData } from '../dummyData';
import { getGroups } from '../services/gatherService';
import CardBase from '../components/cards/CardBase';
import StandardGrid from '../components/general/StandardGrid';


const useStyles = makeStyles(theme => ({
    videoRoot: {
        position: "relative",
        height: `40vh`,
        width: "100%"
    },
    video: {
        objectFit: "cover",
        objectPosition: "center",
        width: "100%",
        height: "100%",
    },
    box: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        "z-index": "1",
        "text-align": "center",
        "padding": theme.spacing(20)
    },
    hl: {
        "margin": theme.spacing(2),
        "color": "white",
        fontSize: "36px"
    },
    sub: {
        "margin": theme.spacing(1),
        "color": "white",
        fontSize: "24px"
    },
    button: {
        "margin": theme.spacing(2),
    },
    contentArea:{
        padding: "15px 20px"
    }
  }));

export default function HomeContainer () {
    const classes = useStyles();

    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            const data = await getGroups()
            setGroups(data);
        };
        fetchGroups();
      }, []);


    return (
        <Fragment>
            <div className={classes.videoRoot}>
                <video
                    className={classes.video}
                    src="https://gather.wtf/static/media/Gather.webm"
                    autoPlay="1"
                    loop="1"
                    muted="1"
                />
                <Container className={classes.box}>
                    <Box>
                        <Typography className={classes.hl} variant="h2">
                            Let's gather
                        </Typography>

                        <Typography className={classes.sub} variant="h4">
                            organise communities and events with real people
                        </Typography>
                        <Button color="primary" size="large" className={classes.button} variant="contained">Discover</Button>
                    </Box>
                </Container>
            </div>
            <div className={classes.contentArea}>
                <Typography variant="h1" component="h2">
                    Groups
                </Typography>
                <StandardGrid>
                    {
                        groups.map(card => 
                            (<CardBase key={card.id} linkPrefix="/groups" id={card.id} {...card.metadata}></CardBase>)
                        )
                    }
                </StandardGrid>
                <Typography variant="h1" component="h2">
                    Events
                </Typography>
                <StandardGrid>
                    {
                        EventCardDummyData.map(card => 
                            (<CardBase key={card.id} linkPrefix="/events" {...card}></CardBase>)
                        )
                    }
                </StandardGrid>
            </div>
            
        </Fragment>
    )
}