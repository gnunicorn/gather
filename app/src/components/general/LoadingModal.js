import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { constants } from '../../theme';
import { CircularProgress } from '@material-ui/core';


const size = 100;
const useStyles = makeStyles(theme => ({
  root: {
    position: "fixed",
    height: "100%",
    width: "100%",
    top: 0,
    left: 0,
    zIndex: 9999999999999,
    opacity:0,
    visibility: "hidden",
    transitionDuration: "200ms",
    "&:before":{
        content: "''",
        position: "absolute",
        height: "100%",
        width: "100%",
        top: 0,
        left: 0,
        opacity: 0.3,
        backgroundColor: constants.colors.purple,
        zIndex: -1
    },
    "&.active":{
        opacity: 1,
        visibility: "visible"
    },
    "& > *":{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        height: size,
        width: size,
        zIndex: 9999
    }
  },
}));

export default function LoadingModal(props) {
    const {
        active
    } = props;
    const classes = useStyles();

    return (
        <section className={classNames(classes.root, active ? "active" : "")}>
            <div>
                <CircularProgress size={size} color="secondary" />
            </div>
        </section>
    );
}