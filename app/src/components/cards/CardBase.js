import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { constants, mixins } from '../../theme';
import { grey } from '@material-ui/core/colors';

import logo from "../../assets/logo.svg";
import ReactSVG from 'react-svg'
import { Card, CardActionArea, CardContent } from '@material-ui/core';
import { Link } from "react-router-dom";

import Blockies from 'react-blockies';

const useStyles = makeStyles(theme => ({
  card:{
    position: "relative",
    padding: 0,
    maxWidth: "40vw",
    width: "100%",
  },
  link:{
    textDecoration: "none",
    "&:hover":{
      textDecoration: "none"
    }
  },
  stamp:{
    position: "absolute",
    top: 10,
    right: 10,

  },
  bannerImage:{
    height: 200,
    [theme.breakpoints.up("xs")]: {
      height: 150
    },
    [theme.breakpoints.up("sm")]: {
      height: 300
    },
    "& > *":{
      width: "100% !important",
      height: "100% !important"
    }
  },
  cardContent:{
    backgroundColor: grey.A700,
    color: constants.colors.white,
  },
  title:{
    textDecoration: "none",
    ...mixins.ellipsisOverflow
  },
  subTitle:{
    textDecoration: "none",
    ...mixins.ellipsisOverflow
  },
  type:{
    textTransform: "capitalize",
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: constants.colors.white,
    padding: "5px 10px",
    borderRadius: "0 10px 0 10px",
    "&> *":{
      fontWeight: 800
    }
  }
}));

export default function CardBase(props) {
  const {
    title,
    subtitle,
    type,
    link,
    bannerImage
  } = props;
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <Link to={link} underline="none" className={classes.link} >
        <CardActionArea>
          <div className={classes.stamp}>
            <ReactSVG 
              src={logo} 
              beforeInjection={svg => {
                svg.setAttribute('style', 'width: 50px; height: 50px')
              }} 
              alt="Logo" />
          </div>
          <div className={classes.type}>
              <Typography variant="body1" component="span">
                {type}
              </Typography>
          </div>
          {/* {
            image && <CardMedia
            className={classes.bannerImage}
            image={}
            title={title} />
          } */}
          {
            !bannerImage && <section className={classes.bannerImage}>
              <Blockies
                seed={`${type}-${title}`}
                size={50}
                scale={10}
                color={constants.colors.purple}
                bgColor={grey.A100}
                spotColor={constants.colors.blue}

              />
            </section>
          }
          <CardContent className={classes.cardContent}>
            <Typography color="inherit" className={classes.title} variant="h5" component="h3" gutterBottom>
              {title}
            </Typography>
            <Typography color="inherit" className={classes.subtitle} variant="h5" component="h3" gutterBottom>
              {subtitle}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}