import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';

import NodeInfo from "./NodeInfo";


const useStyles = makeStyles(theme => ({
    footer: {
      flexGrow: 1,
    }
  }));
  
export default function Footer(props) {
  const classes = useStyles();
  const {apiReady, api} = props;

  return (<footer classes={classes.footer} >
        <Container>
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
            >
                <div>Menu 1</div>
                <div>Menu 2</div>
                <div>{apiReady ? <NodeInfo api={api} /> : <CircularProgress />}</div>
            </Grid>
        </Container>
    </footer>)
}