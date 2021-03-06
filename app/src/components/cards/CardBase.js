import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { constants, mixins } from '../../theme';
import { grey } from '@material-ui/core/colors';
import { get } from '../../services/ipfsService';

import logo from "../../assets/logo.svg";
import ReactSVG from 'react-svg'
import { Card, CardMedia, CardActionArea, CardContent } from '@material-ui/core';
import { Link } from "react-router-dom";

import Blockies from 'react-blockies';

const useStyles = makeStyles(theme => ({
  card:{
    position: "relative",
    padding: 0,
    maxWidth: "450px",
    backgroundColor: grey.A700,
    width: "100%",
  },
  media: {
    width: "100%",
    // paddingTop: '56.25%', // 16:9
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
  },
  actionArea:{
    display: "flex",
    height: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  }
}));

function CardImage(props) {
  const classes = useStyles();
  const [imgUrl, setImgUrl] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
          const data = await get(props.bannerImage.slice(5))
          console.log("got data", data);
          const blob = new Blob( [ data ], { type: "image/jpeg" } );
          const imageUrl = window.URL.createObjectURL( blob );
          setImgUrl(imageUrl);
      };
      if (!!props.bannerImage) fetchData();
    }, []);

    if(!!imgUrl && !!imgUrl.length) {
      console.log("got data, adding image", imgUrl);
      return <img className={classes.media} src={imgUrl} banner={props.bannerImage} />
      return <CardMedia
                className={classes.media}
                image={imgUrl}
                title={props.title}
              />;
    }

    return <section className={classes.bannerImage}>
      <Blockies
        seed={`${props.type}-${props.title}`}
        size={50}
        scale={10}
        color={constants.colors.purple}
        bgColor={grey.A100}
        spotColor={constants.colors.blue}
      />
    </section>
}

export default function CardBase(props) {
  const {
    id,
    title,
    subtitle,
    type,
    linkPrefix,
    bannerImage
  } = props;
  const classes = useStyles();
  const link = `${linkPrefix}/${id}`;
  return (
    <Card className={classes.card}>
      <Link to={link} underline="none" className={classes.link} >
        <CardActionArea className={classes.actionArea}>
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
          <CardImage type={type} bannerImage={bannerImage} title={title} />
          <CardContent className={classes.cardContent}>
            <Typography color="inherit" className={classes.title} variant="h5" component="h3" gutterBottom>
              {title}
            </Typography>
            <Typography color="inherit" className={classes.tagline} variant="h5" component="h3" gutterBottom>
              {subtitle}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}