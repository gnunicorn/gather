import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { grey } from '@material-ui/core/colors';

import NodeInfo from "./NodeInfo";


const useStyles = makeStyles(theme => ({
    footer: {
      flexGrow: 1,
      marginTop: theme.spacing(2),
      padding: theme.spacing(2),
      backgroundColor: "#424242", // grey.A700,
      color: grey.A200,
      minHeight: "200px",
    }
  }));
  
export default function Footer(props) {
  const classes = useStyles();
  const {apiReady, api} = props;

  return (<footer className={classes.footer} >
        <Container>
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="top"
            >
                <div>Menu 1</div>
                <div>Menu 2</div>
                <div>
                    Node<p>
                    {apiReady ? <NodeInfo api={api} /> : <CircularProgress color="inherit" />}
                        
                    </p></div>
            </Grid>
        </Container>
    </footer>)
}