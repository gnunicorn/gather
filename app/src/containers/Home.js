
import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles(theme => ({
    root: {
    },
    video: {
        "position": "absolute",
        "top": 0,
        "right": 0,
        "left": 0,
        "min-width": "100%",
        "max-width": "100%",
        "overflow": "hidden",
        "z-index": "-1",
        "transform": "translateY(-20%)",
    },
    box: {
        "z-index": "1",
        "text-align": "center",
        "padding": theme.spacing(20)
    },
    hl: {
        "margin": theme.spacing(2),
        "color": "white",
    },
    sub: {
        "margin": theme.spacing(1),
        "color": "white",
    },
    button: {
        "margin": theme.spacing(2),
    },
  }));

export default function Home () {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <video
                className={classes.video}
                src="http://unterbau.tech:8080/ipfs/QmSKx4LDZHFLTgWWw3g9AH2MzVbpKUFjLYBvQ2LugLC5Ac"
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
    )
}