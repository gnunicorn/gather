
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
        paddingBottom: constants.footerArea,
    },
    contentArea:{
        // padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`
    }
  }));

export default function AppWrapper (props) {
    const {apiReady, api, children} = props;
    const classes = useStyles();

    return (
    <div className={classes.root}>
        <Header />
        <section className={classes.contentArea}>
            {children}
        </section>
        <Footer apiReady={apiReady} api={api} />
    </div>
    )
}