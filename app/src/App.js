import { ApiPromise, WsProvider } from '@polkadot/api';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
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
  

  return (
    <Router>
      <AppWrapper apiReady={apiReady} api={api} >
        <Switch>
          <Route exact path="/create-group" component={CreateGroupContainer}/>
          <Route exact path="/group/:groupId/edit" component={EditGroupContainer}/>
          <Route exact path="/groups/:groupId"  component={ViewGroupContainer}/>
          <Route exact path="/groups" component={GroupsPageContainer}/>

          <Route exact path="/create-event/:groupId" component={CreateEventContainer}/>
          <Route exact path="/events/:eventId/edit" component={EditEventContainer}/>
          <Route exact path="/events/:eventId"  component={ViewEventContainer} />
          <Route exact path="/events" component={EventsPageContainer}/>
         
          <Route exact path="/ui-master" render={(props) => <UIMasterPage {...props}></UIMasterPage>}/>

          <Route exact path="/" component={HomeContainer}/>
        </Switch>
      </AppWrapper>
    </Router>
   
  );
}
