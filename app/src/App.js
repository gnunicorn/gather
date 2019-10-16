import { ApiPromise, WsProvider } from '@polkadot/api';
import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import NodeInfo from './NodeInfo';

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

  const loader = function (text){
    return (
      <CircularProgress />
    );
  };
  
  if(!apiReady){
    return loader('Connecting to the blockchain')
  }

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Connected
        </Typography>

        <NodeInfo
          api={api}
        />
      </Box>
    </Container>
  );
}
