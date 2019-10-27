import Ipfs from 'ipfs';
import Buffer from 'buffer/';

// FIXME: make this configurable at build time
const GATHER_IPFS = "/dns4/ipfs.gather.wtf/tcp/443/wss/ipfs/QmWmL9vEpxyysEktUo6o3SJsyMTNPKCcffgmjGYaixiqVF";
const LOCALHOST = "/ip4/127.0.0.1/tcp/8081/ws/ipfs/QmZyyjLEjWYjUpdAxHAZww4UxothFZPAWDka9hSXwRwu59";

const CODER = new TextDecoder("utf-8");

let ipfs = null;

export async function get_ipfs() {
    if (ipfs) {
        return ipfs
    }
    ipfs = Ipfs.create({'repo': 'gather'});
    window.ipfs = await ipfs;
    await window.ipfs.libp2p.dial(LOCALHOST);
    await window.ipfs.libp2p.dial(GATHER_IPFS);
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
    // id = "QmZG2mGFH7fuzhF3B6xnEv8wYZJ8Rirvmg3AyDRnHPoabu";
    let ipfs = await get_ipfs();
    console.log("fetching", id);
    let last_case = window.last_case = ipfs.cat(id);
    console.log(last_case);
    return  last_case;
}