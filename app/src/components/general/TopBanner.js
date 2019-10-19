import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import logo from "../../assets/logo.svg";
import ReactSVG from 'react-svg'
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root:{
        maxHeight: "30vh",
        position: "relative",
        height: "100vh" // works like 100% without requiring parent context
    },
    image:{
        position: "absolute",
        top:0,
        left:0,
        zIndex: -1,
        width: "100%",
        height: "100%"
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
            width: "15vh",
            
        }
    },
    metaArea:{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: "100%",
        zIndex: 1
    }
  }));
  
export default function TopBanner(props) {
    const classes = useStyles();

    const {
        bannerImage,
        title,
        subtitle
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
                </Fragment> :  <ReactSVG 
                        src={logo} 
                        beforeInjection={svg => {
                        svg.setAttribute('style', 'width: 100%; height: 100%')
                        }} 
                        className={classes.default}
                        alt="Gather Logo"/>
            }
        </div>
        <div className={classes.metaArea}>
            <Typography variant="h1" component="h1" >
              {title}
            </Typography>
            <Typography variant="h3" component="h3" >
              {subtitle}
            </Typography>
        </div>
    </section>)
}