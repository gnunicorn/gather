import { Keyring } from '@polkadot/keyring';
import { createHash } from 'crypto-browserify';
import Buffer from 'buffer/';

export function signup(email, password) {
    var keypair = getKeypairFromEmailPassword(email, password);
}

export function login(email, password) {
    var keypair = getKeypairFromEmailPassword(email, password);
    localStorage.setItem('user', keypair);
    return true;
}

export function logout() {
    localStorage.setItem('user', null);
    return true;
}

function getKeypairFromEmailPassword(email, password) {
    console.log(email, password);
    let hash = createHash('sha256');
    let bytes = Buffer.Buffer.from(email+password);
    hash.update(bytes);
    var digest = hash.digest('hex');
    console.log(digest);

    const keyring = new Keyring({ type: 'sr25519' });
    const pair = keyring.addFromUri('0x'+ digest);
    console.log(pair);
    return pair;
}




