import * as ipfsService from './ipfsService';
import * as substrateService from './substrateService';
import { Keyring } from '@polkadot/keyring';
import { hexToString } from '@polkadot/util';
import { customTypes } from './types';

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

export async function getGroups() {
    const hardcodedIdPatch = [1,2];
    return new Promise(async (resolve, reject) => {
        const api = await substrateService.createApi();
        const communitiesGroups = await Promise.all(hardcodedIdPatch.map(async id => {
            return await api.query.gather.communitiesGroups(id);
        }));
        let groups = []
        await Promise.all(communitiesGroups.map(async community => {
            await Promise.all(community.map(async group => {
                groups.push(await api.query.gather.groups(group));
            }))
        }))

        // const resolvedGroups = await Promise.all(groups.map(async group => {
        //     const ipfsId = JSON.parse(group.toString()).metadata;
        //     console.log(ipfsId);
        //     return ipfsId !== "0x" ? JSON.parse( await ipfsService.get(hexToString(ipfsId))) : "";
        // }))
        const resolvedGroups = groups.map(group => JSON.parse(group.toString()));
        resolve(resolvedGroups);
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

export async function joinGroup(groupId) {
    return new Promise(async (resolve, reject) => {
        const api = await substrateService.createApi();
        const keyring = new Keyring({ type: 'sr25519' });
        const userHex = localStorage.getItem('user');
        const keys = keyring.addFromUri('0x' + userHex);
        const nonce = await api.query.system.accountNonce(keys.address);
        api.tx.gather
            .joinGroup(groupId)
            .signAndSend(keys, { nonce }, ({ events = [], status }) => {
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

export async function rsvp(eventId) {
    console.log(eventId);
    return new Promise(async (resolve, reject) => {
        const api = await substrateService.createApi();
        const keyring = new Keyring({ type: 'sr25519' });
        const userHex = localStorage.getItem('user');
        const keys = keyring.addFromUri('0x' + userHex);
        const nonce = await api.query.system.accountNonce(keys.address);
        api.tx.gather
            .rsvpGathering(eventId, customTypes.RSVPStates._enum[0])
            .signAndSend(keys, { nonce }, ({ events = [], status }) => {
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

export async function joinCommunity(communityId, userHex) {
    return new Promise(async (resolve, reject) => {
        const api = await substrateService.createApi();
        const keyring = new Keyring({ type: 'sr25519' });
        const keys = keyring.addFromUri('0x' + userHex);
        const nonce = await api.query.system.accountNonce(keys.address);
        api.tx.gather
            .joinCommunity(communityId)
            .signAndSend(keys, { nonce }, ({ events = [], status }) => {
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