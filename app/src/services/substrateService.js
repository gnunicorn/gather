import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { customTypes } from './types';

export async function createApi() {
    const provider = new WsProvider(process.env.REACT_APP_WS_TARGET || 'ws://127.0.0.1:9944');
    return await ApiPromise.create({ provider, types: customTypes });
}

export async function fundAccount(address) {
    return new Promise(async (resolve, reject) => {
        const api = await createApi();
        const keyring = new Keyring({ type: 'sr25519' });
        const alice = keyring.addFromUri('//Alice');
        console.log(address);
        api.tx.balances
            .transfer(address, 100000)
            .signAndSend(alice, (result) => {
            if (result.status.isFinalized) {
                console.log(`Transaction included at blockHash ${result.status.asFinalized}`);
                resolve(result.isCompleted);
            }
        });
    });
}

