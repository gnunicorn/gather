import { ApiPromise, WsProvider } from '@polkadot/api';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  // Link
} from "react-router-dom";
import { AnimatedSwitch } from 'react-router-transition';

import HomeContainer from "./containers/HomeContainer";
import AppWrapper from "./containers/AppWrapper";
import UIMasterPage from './containers/UIMasterPage';
import CreateEventContainer from './containers/CreateEventContainer';
import CreateGroupContainer from './containers/CreateGroupContainer';
import EventsPageContainer from './containers/EventsPageContainer';
import GroupsPageContainer from './containers/GroupsPageContainer';
import ViewEventContainer from './containers/ViewEventContainer';
import ViewGroupContainer from './containers/ViewGroupContainer';
import EditGroupContainer from './containers/EditGroupContainer';
import EditEventContainer from './containers/EditEventContainer';
import SignupContainer from './containers/SignupContainer';
import LoginContainer from './containers/LoginContainer';
import { makeStyles } from '@material-ui/core';

// import * as gatherService from './services/gatherService';
const useStyles = makeStyles(theme => ({
  switchWrapper:{
    position: "relative",
    width: "100%",
    "& > div":{
      position: "absolute",
      width: "100%",
    }
  }
}));

export default function App () {
  const [api, setApi] = useState();
  const [apiReady, setApiReady] = useState();
  const classes = useStyles();

  useEffect(() => {
    const provider = new WsProvider(process.env.REACT_APP_WS_TARGET || 'ws://127.0.0.1:9944');

    ApiPromise.create({provider})
      .then((api) => {
        setApi(api);
        api.isReady.then(() => setApiReady(true));
      })
      .catch((e) => console.error(e));
  }, []);

  // gatherService.createGroup({ name: 'group1' }).then(console.log);
  // gatherService.getGroupDetails('').then(console.log);

  return (
    <Router>
      <AppWrapper apiReady={apiReady} api={api} >
        <AnimatedSwitch
          atEnter={{ opacity: 0 }}
          atLeave={{ opacity: 0 }}
          atActive={{ opacity: 1 }}
          className={classes.switchWrapper}
        >
          <Route exact path="/groups/new" component={CreateGroupContainer}/>
          <Route exact path="/groups/:groupId/edit" component={EditGroupContainer}/>
          <Route exact path="/groups/:groupId"  component={ViewGroupContainer}/>
          <Route exact path="/groups" component={GroupsPageContainer}/>

          <Route exact path="/events/:eventId/edit" component={EditEventContainer}/>
          <Route exact path="/events/:eventId"  component={ViewEventContainer} />
          <Route exact path="/events/new/:groupId" component={CreateEventContainer}/>
          <Route exact path="/events" component={EventsPageContainer}/>
         
          <Route exact path="/signup" component={SignupContainer}/>
          <Route exact path="/login" component={LoginContainer}/>

          <Route exact path="/ui-master" render={(props) => <UIMasterPage {...props}></UIMasterPage>}/>

          <Route exact path="/" component={HomeContainer}/>
        </AnimatedSwitch>
      </AppWrapper>
    </Router>
   
  );
}
