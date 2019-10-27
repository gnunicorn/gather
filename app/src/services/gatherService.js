import * as ipfsService from './ipfsService';
import * as substrateService from './substrateService';
import { Keyring } from '@polkadot/keyring';
import { hexToString } from '@polkadot/util';
import { customTypes } from './types';
import Buffer from 'buffer/';

const DEBUG = true;
const CODER = new TextDecoder("utf-8");

// super simple cache
const CACHE = {
    "communitiesIdx": [],
    "communities": {},
    "groupsIdx": [],
    "groups": {},
    "gatheringsIdx": [],
    "gatherings": {},
}

export async function createGroup(group) {
    return new Promise(async (resolve, reject) => {
        const ipfsHash = await ipfsService.add(group);
        DEBUG && console.log(ipfsHash);
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

function makeApi(item, items, idx_prefix, parent) {
    items = items || `${item}s`;
    idx_prefix = idx_prefix || "";
    async function item_getter(id) {
        const api = await substrateService.createApi();
        const cache = CACHE[items];
        if (cache[id]) {
            return new Promise((resolve, _)=>{
                DEBUG && console.log(`Loaded result for ${item}(${id})`);
                resolve(cache[id]);
            })
        };
        const entry = await api.query.gather[items](id);
        entry.id = id;
        DEBUG && console.log(`Found ${item}(${id}) => ${entry}`);
        window.entry = entry;
        if (entry.raw.metadata) {
            DEBUG && console.log(`Loading IPFS data ${entry.raw.metadata} for ${item}(${id})`);
            const details = await ipfsService.get(Buffer.Buffer.from(entry.raw.metadata));
            console.log(details);
            const metadata = CODER.decode(details);
            console.log(metadata);
            entry.metadata = JSON.parse(metadata);
        }
        DEBUG && console.log(`Caching ${item}(${id})`);
        cache[id] = entry;
        return entry; 
    };
    
    async function list_getter(parent_id) {
        const api = await substrateService.createApi();
        let ids = CACHE[`${items}Idx`];
        if (!parent_id) {
            DEBUG && console.log(`Checked cache for ${items}: ${ids}`);

            if (!ids || ids.length == 0) {
                const key = `${idx_prefix}${items}Idx`;
                DEBUG && console.log(`Loading ${items}:${key}`);
                ids = await api.query.gather[key]();
                CACHE[`${items}Idx`] = ids;
            }
        } else {
            let key = `${parent}${item}`;
            ids = CACHE[key];
            DEBUG && console.log(`Checked cache for ${items}: ${ids}`);

            if (!ids || ids.length == 0) {
                const key = `${idx_prefix}${items}Idx`;
                DEBUG && console.log(`Loading ${items}:${key}`);
                ids = await api.query.gather[key]();
                CACHE[key] = ids;
            }

        }
        DEBUG && console.log(`Fetching details for ${items}: ${ids}`);
        return Promise.all(ids.map(async (id) => item_getter(id)));
    };

    let fns = {};
    fns[`get${items}`] = list_getter;
    fns[`get${item}`] = item_getter;

    return fns;
}
export const { getcommunity: getCommunity, getcommunities: getCommunities } = makeApi("community", "communities");
export const { getgroup: getGroup, getgroups: getGroups } = makeApi("group", "groups", "", "communities");
export const { getgathering: getGathering, getgatherings: getGatherings } = makeApi("gathering", "gatherings", "upcoming", "groups");



export async function joinGroup(groupId) {
    console.log(groupId);
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