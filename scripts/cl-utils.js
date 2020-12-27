// Ref: Delivery-link, Dan Forbes, https://github.com/danforbes/delivery-link/blob/master/chainlink/cl-utils.js

const http = require('http');

module.exports = {
    createBridge: createBridge,
    createJob: createJob,
    createTask: createTask,
    getAcctAddr: getAcctAddr,
    postBridge: postBridge,
    postJob: postJob,
};

function createBridge(name, url) {
    return {name: name, url: url};
}

function createJob(initiatorType) {
    return {
        initiators: [
            {
                type: initiatorType,
                params: {}
            }
        ],
        tasks: []
    }
}

function createTask(type) {
    return {type: type, params: {}};
}

async function getAcctAddr() {
    const sessionCookie = await getSessionCookie();
    const opts = {
        host: 'localhost',
        port: '6688',
        path: '/v2/user/balances',
        method: 'GET',
        headers: {
            'Cookie': sessionCookie
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(opts, (res) => {
            res.setEncoding('utf-8')

            let resBody = '';
            res.on('data', (chunk) => {
                resBody += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(resBody).data[0].id);
            });

            res.on('error', (err) => {
                reject(err);
            });
        });

        req.end();
    });
}

async function postBridge(bridge) {
    const sessionCookie = await getSessionCookie();
    const opts = {
        host: 'localhost',
        port: '6688',
        path: '/v2/bridge_types',
        method: 'POST',
        headers: {
            'Cookie': sessionCookie
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(opts, (res) => {
            res.setEncoding('utf-8')

            let resBody = '';
            res.on('data', (chunk) => {
                resBody += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(resBody));
            });

            res.on('error', (err) => {
                reject(err);
            });
        });

        req.write(JSON.stringify(bridge));
        req.end();
    });
}

async function postJob(job) {
    const sessionCookie = await getSessionCookie();
    const opts = {
        host: 'localhost',
        port: '6688',
        path: '/v2/specs',
        method: 'POST',
        headers: {
            'Cookie': sessionCookie
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(opts, (res) => {
            res.setEncoding('utf-8')

            let resBody = '';
            res.on('data', (chunk) => {
                resBody += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(resBody));
            });

            res.on('error', (err) => {
                reject(err);
            });
        });

        req.write(JSON.stringify(job));
        req.end();
    });
}

let cookie;
function getSessionCookie() {
    if (cookie) {
        return Promise.resolve(cookie);
    }

    const opts = {
        host: 'localhost',
        port: '6688',
        path: '/sessions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(opts, (res) => {
            res.setEncoding('utf-8');

            res.on('data', () => { /* DO NOTHING */ });
            res.on('end', () => {
                cookie = res.headers["set-cookie"][0];
                resolve(cookie);
            });

            res.on('error', (err) => {
                reject(err);
            });
        });

        const reqBody = JSON.stringify({
            email: 'test@stacktical.com',
            password: 'password'
        });

        req.write(reqBody);
        req.end();
    });
}
