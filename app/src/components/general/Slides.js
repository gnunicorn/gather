
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const useStyles = makeStyles(theme => ({
  root:{
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "row"
  },
  slide:{
    overflow: "hidden",
    width: 0,
    height: "0",
    transitionProperty: "width",
    transitionDuration: "400ms",
    "&.active":{
        width: "100%",
        height: "100%"
    },
    "& > *":{
        width: "100vw"
    }
  }
  }));
  
export default function Slides(props) {
  const classes = useStyles();
  const {
    children,
    slideIndex
  } = props;

  return (<section className={classes.root}>
      {
        React.Children.map(children, (child, i) => 
        <div className={classNames(classes.slide, i === slideIndex ? "active" : "")}>
            {child}
        </div>
        )}
   </section>)
}

 