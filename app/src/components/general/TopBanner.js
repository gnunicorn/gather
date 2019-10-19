import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import logo from "../../assets/logo.svg";
import ReactSVG from 'react-svg'
import { Typography } from '@material-ui/core';
import { constants } from '../../theme';
import Blockies from 'react-blockies';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
    root:{
        maxHeight: "30vh",
        position: "relative",
        height: "100vh", // works like 100% without requiring parent context
    },
    image:{
        position: "absolute",
        top:0,
        left:0,
        zIndex: -1,
        width: "100%",
        height: "100%",
        backgroundColor: constants.colors.blue,
        "& canvas":{
            width: "100% !important",
            height: "100% !important",
            opacity: 0.5
        }
    },
    stamp:{
        position: "absolute",
        top: 10,
        right: 10,
    },
    default:{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        height: "50%",
        "& > *":{
            height: "100%",
            width: "12.5vh", 
        },
      
    },
  }));
  
export default function TopBanner(props) {
    const classes = useStyles();

    const {
        bannerImage,
        title
    } = props;

    return (
    <section className={classes.root}>
        <div className={classes.image}>
            {
                bannerImage ? <Fragment>
                    <ReactSVG 
                        src={logo} 
                        beforeInjection={svg => {
                        svg.setAttribute('style', 'width: 100%; height: 100%')
                        }} 
                        className={classes.stamp}
                        alt="Gather Logo"/>
                    <img src={bannerImage} alt={title} />
                </Fragment> :  <Fragment>
                    <Blockies
                        seed={`group-${title}`}
                        size={50}
                        scale={10}
                        color={constants.colors.purple}
                        bgColor={grey.A100}
                        spotColor={constants.colors.blue}

                    />
                    <ReactSVG 
                        src={logo} 
                        beforeInjection={svg => {
                        svg.setAttribute('style', 'width: 100%; height: 100%')
                        }} 
                        className={classes.default}
                        alt="Gather Logo"/>
                </Fragment>
                
            }
        </div>
    </section>)
}