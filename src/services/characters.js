const fs = require("fs");

let survivors = {};
let killers = {};

/**
 * @description Load characters info.
 */
function init() {
    fs.readFile('assets/characters/survivors.json', 'utf8', function (err, data) {
        if (err) return console.log(err);
        const msg = JSON.parse(data);
        for (let x = 0; x < msg.survivors.length; x++) {
            survivors[x] = {
                name: msg.survivors[x].name,
                link: msg.survivors[x].link
            }
        }
    });
    fs.readFile('assets/characters/killers.json', 'utf8', function (err, data) {
        if (err) return console.log(err);
        const msg = JSON.parse(data);
        for (let x = 0; x < msg.killers.length; x++) {
            killers[x] = {
                nameEs: msg.killers[x].nameEs,
                nameEn: msg.killers[x].nameEn,
                link: msg.killers[x].link
            }
        }
    });
}

function getKillers() {
    return killers;
}

function getSurvivors() {
    return survivors;
}

/*
setTimeout(() => {
    const iterator = survivors
    let requests = [];
    for (let key in iterator) {
        const index = iterator[key].link.indexOf(".net") > -1 ? iterator[key].link.indexOf(".net") + 4 : iterator[key].link.indexOf(".com") + 4
        const host = iterator[key].link.substring(8, index);
        const path = iterator[key].link.substring(index);
        let options = {
            host: host,
            path: path,
            headers: { 'User-Agent': 'EntityBot/1.1' }
        };
        requests.push(options);
    }

    setInterval(() => {
        const lastRequest = requests[0];
        if (lastRequest) {
            requests.splice(requests.indexOf(lastRequest), 1);
            let req = https.get(lastRequest, function (res) {
                let bodyChunks = [];

                res.on('data', function (chunk) {
                    bodyChunks.push(chunk);
                });

                res.on('end', function () {
                    if (res.statusCode == 200 || res.statusCode == 201) {
                        console.log("status code normal - " + req.host + req.path);
                    } else {
                        console.log(`status code ERR 2: ${res.statusCode} | ${req.host}${req.path}`);
                    }
                });
            });

            req.on('error', function (e) {
                console.error(`Error: ${e}`);
            });

            req.end();
        }
    }, 500);
}, 1000);*/

module.exports = {
    init: init,
    getKillers: getKillers,
    getSurvivors: getSurvivors
}