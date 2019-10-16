import { ApiPromise, WsProvider } from '@polkadot/api';
import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

import Footer from "./Footer";
import TopBar from './MenuBar';

export default function App () {
  const [api, setApi] = useState();
  const [apiReady, setApiReady] = useState();
  const WS_PROVIDER = 'ws://127.0.0.1:9944';

  useEffect(() => {
    const provider = new WsProvider(WS_PROVIDER);

    ApiPromise.create({provider})
      .then((api) => {
        setApi(api);
        api.isReady.then(() => setApiReady(true));
      })
      .catch((e) => console.error(e));
  }, []);
  

  return (
    <div>
      <header>
        <TopBar />
      </header>
      <Container maxWidth="sm">
        <Box my={4}>
        </Box>
      </Container>
      <Footer apiReady={apiReady} api={api} />
    </div>
  );
}
