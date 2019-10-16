
import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles(theme => ({
    root: {
        "position": "relative",
        "overflow": "hidden",
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
                src="https://doc-0c-8s-docs.googleusercontent.com/docs/securesc/ha0ro937gcuc7l7deffksulhg5h7mbp1/3o4avp1ans76bq5h9c06hilep51qskht/1571234400000/07470069817889151082/*/1lebr1VIOViEVX5NLATJOwViyX_kP8JPt?e=download"
                autoplay="1"
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