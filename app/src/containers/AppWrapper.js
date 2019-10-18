
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { constants } from '../theme';

import Header from "../components/Header";
import Footer from "../components/Footer";


const useStyles = makeStyles(theme => ({
    root: {
        "position": "relative",
        "overflow": "hidden",
        minHeight: "100vh",
        paddingBottom: constants.footerArea
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

export default function AppWrapper (props) {
    const {apiReady, api, children} = props;
    const classes = useStyles();

    return (
    <div className={classes.root}>
        <Header />
        {children}
        <Footer apiReady={apiReady} api={api} />
    </div>
    )
}