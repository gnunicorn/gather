import React, {useEffect, useState, Fragment} from 'react';

export default function BlockNumner(props) {
  const {api} = props;
  const [blockNumber, setBlockNumber] = useState(0);

  useEffect(() => {
    let unsubscribeAll = null;
    api.derive.chain.bestNumber(number => {
      setBlockNumber(number.toNumber());
    }).then(unsub => {
      unsubscribeAll = unsub;
    }).catch(console.error);

    return () => unsubscribeAll && unsubscribeAll();
  }, []);

  return (
    <Fragment>
      {'Block Number:'} {blockNumber}
      <hr/>
    </Fragment>
  )
}
