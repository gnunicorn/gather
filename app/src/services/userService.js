import { Keyring } from '@polkadot/keyring';
import { createHash } from 'crypto-browserify';
import Buffer from 'buffer/';
import * as substrateService from './substrateService';

export async function signup(email, password) {
    var hex = getHexFromEmailPassword(email, password);
    var keypair = getKeyPairFromHex(hex);
    return await substrateService.fundAccount(keypair.address);
}

export function login(email, password) {
    var hex = getHexFromEmailPassword(email, password);
    localStorage.setItem('user', hex);
    return true;
}

export function logout() {
    localStorage.setItem('user', null);
    return true;
}

function getHexFromEmailPassword(email, password) {
    console.log(email, password);
    let hash = createHash('sha256');
    let bytes = Buffer.Buffer.from(email+password);
    hash.update(bytes);
    var digest = hash.digest('hex');
    console.log(digest);
    return digest;
}

function getKeyPairFromHex(hex) {
    const keyring = new Keyring({ type: 'sr25519' });
    const pair = keyring.addFromUri('0x'+ hex);
    console.log(pair);
    return pair;
}




