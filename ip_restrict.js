const EVERY_SECOND = 1000;
const EVERY_MINUTE = 60 * EVERY_SECOND;
const EVERY_HOUR = 60 * EVERY_MINUTE;

const https = require('https');

let allowed_ips = [];

function query_ips(domain) {
    return new Promise(function(resolve, reject) {
        const DNS_QUERY_URL = 'https://dnsjson.com/' + domain + '/A.json';
        console.log("Fetching all DNS entries for whitelisted domain: " + DNS_QUERY_URL);
        https.get(DNS_QUERY_URL, (resp) => {
            let data = '';

            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                var dat = JSON.parse(data);
                console.log("DNS query finished, result:\n", dat);
                resolve(dat);
            });

            resp.on("error", (err) => {
                console.error("ERROR:\n", err);
                reject(err);
            });
        });
    });
}

let _ready = {
    "promise": null,
    "resolve": null,
    "reject": null,
    "init": false
};

function _init_ready() {
    _ready.promise = new Promise((resolve, reject) => {
        _ready.resolve = resolve;
        _ready.reject = reject;
    });
    _ready.init = false;
}

_init_ready();

function update_dns_ips(domain) {
    console.log("DNS update run");
    query_ips(domain).then(
        (data) => {
            console.log("DNS response received");
            if (data.success) {
                if (data.results.type == 'A') {
                    allowed_ips = data.results.records;
                    console.log("DNS response success, expected type (A), current IPs:\n", allowed_ips);
                    if (!_ready.init) {
                        _ready.resolve(undefined);
                        _ready.init = true;
                        // Stop flow.
                        return;
                    }
                }
            }
            console.error("ERROR: DNS response not successful, unknown error");
        },
        (err) => {
            console.error("ERROR while updating IPs:", err);
        }
    );
}

let _update_loop = null;

function start_dns_loop(domain) {
    console.log("Starting DNS update loop");
    update_dns_ips(domain);
    _update_loop = setInterval(() => { return update_dns_ips(domain); }, EVERY_HOUR);
}

function stop_dns_loop() {
    console.log("Stopping DNS update loop");
    var loop_id = null;
    [loop_id, _update_loop] = [_update_loop, loop_id];
    clearInterval(loop_id);
    _init_ready();
}

function ready() {
    return _ready.promise;
}

function middleware(req, res, next) {
    if (allowed_ips.indexOf(req.ip) >= 0) {
        next();
        return;
    }
    
    console.error("ERROR: Request not allowed, untrusted IP: " + req.ip);
    res.sendStatus(403);
}

module.exports = {
    start_dns_loop: start_dns_loop,
    stop_dns_loop: stop_dns_loop,
    ready: ready,
    middleware: middleware
};
