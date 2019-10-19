import * as ipfsService from './ipfsService';
import * as substrateService from './substrateService';
import { Keyring } from '@polkadot/keyring';
import { hexToString } from '@polkadot/util';

export async function createGroup(group) {
    return new Promise(async (resolve, reject) => {
        const ipfsHash = await ipfsService.add(group);
        console.log(ipfsHash);
        const api = await substrateService.createApi();
        const keyring = new Keyring({ type: 'sr25519' });
        const alice = keyring.addFromUri('//Alice');
        const nonce = await api.query.system.accountNonce(alice.address);
        api.tx.gather
            .createGroup(1, ipfsHash, null)
            .signAndSend(alice, { nonce }, ({ events = [], status }) => {
                if (status.isFinalized) {
                    console.log(`Transaction included at blockHash ${status.asFinalized}`);
                }

                events.forEach(({ phase, event: { data, method, section } }) => {
                    console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
                    resolve(data[1]);
                });
            });
    });
}

export async function getGroupDetails(id) {
    return new Promise(async (resolve, reject) => {
        const api = await substrateService.createApi();
        const group = await api.query.gather.groups(id);
        const ipfsId = JSON.parse(group.toString()).metadata;
        console.log(ipfsId);
        const obj = await ipfsService.get(hexToString(ipfsId));
        resolve(JSON.parse(obj));
    });
}