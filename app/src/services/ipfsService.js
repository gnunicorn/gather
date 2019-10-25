import Ipfs from 'ipfs';
import Buffer from 'buffer/';

// FIXME: make this configurable at build time
const GATHER_IPFS = "/dns4/ipfs.gather.wtf/tcp/443/wss/ipfs/QmWmL9vEpxyysEktUo6o3SJsyMTNPKCcffgmjGYaixiqVF";
const LOCALHOST = "/ip4/127.0.0.1/tcp/8081/ws";

let ipfs = null;

export async function get_ipfs() {
    if (ipfs) {
        return ipfs
    }
    ipfs = Ipfs.create({'repo': 'gather'});
    window.ipfs = await ipfs;
    await window.ipfs.libp2p.dial(GATHER_IPFS);
    await window.ipfs.libp2p.dial(LOCALHOST);
    return ipfs
}

get_ipfs();

export async function add(data) {
    let ipfs = await get_ipfs();
    const bytes = Buffer.Buffer.from(JSON.stringify(data));
    console.log(bytes);
    return new Promise((resolve, reject) => {
        ipfs.add(bytes, (err, res) => {
            if(err) {
                reject(err);
            }

            console.log(res);
            resolve(res[0].hash);
        });
    });
}

export async function get(id) {
    if (!id) {
        return Promise.reject("No id provided");
    }
    let ipfs = await get_ipfs();
    console.log("fetching", id);
    return ipfs.get(id);
}