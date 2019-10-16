import { ApiPromise, WsProvider } from '@polkadot/api';
import React, { useState, useEffect } from 'react';

import Home from "./Home";
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
      <Home />
      <Footer apiReady={apiReady} api={api} />
    </div>
  );
}
