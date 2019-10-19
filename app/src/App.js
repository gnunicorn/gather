import { ApiPromise, WsProvider } from '@polkadot/api';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
  // Link
} from "react-router-dom";

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

// import * as gatherService from './services/gatherService';
export default function App () {
  const [api, setApi] = useState();
  const [apiReady, setApiReady] = useState();

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
        <Switch>
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
        </Switch>
      </AppWrapper>
    </Router>
   
  );
}
