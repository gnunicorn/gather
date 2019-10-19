import ipfsClient from 'ipfs-http-client';
import Buffer from 'buffer/';

const ipfs = ipfsClient('localhost', '5001');

export async function add(data) {
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
    return new Promise((resolve, reject) => {
        ipfs.get(id, (err, data) => {
            if(err) {
                reject(err);
            }
            console.log(data);
            const content = data[0].content.toString('utf8');
            resolve(content);
        })
    })
}