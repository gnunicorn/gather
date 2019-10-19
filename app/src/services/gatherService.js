import * as ipfsService from './ipfsService';
import * as substrateService from './substrateService';

export async function createGroup(group) {
    const ipfsHash = await ipfsService.add(group);
    return ipfsHash;
}

export async function getGroupDetails(id) {
    const obj = await ipfsService.get('QmYhJgp6fqgiJpdYKFMLVB5EyhvShNPehd6poYyCeow8ZD');
    console.log(JSON.parse(obj));
}