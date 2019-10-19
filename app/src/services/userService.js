import keyring from '@polkadot/ui-keyring';
import { CryptoJS } from 'crypto-browserify';

export function signup(email, password) {
    let hash = CryptoJS.SHA256(email+password);
    console.log(hash);
}




