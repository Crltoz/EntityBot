const mysql = require("mysql");
const localConfig = require("../data/database.json");

let con;

/* MySQL config */
let db_config = {
    host: localConfig.host,
    user: localConfig.user,
    password: localConfig.password,
    database: localConfig.db
}

/**
 * @description - Load MySQL Data base.
 */
async function init(context) {
    con = mysql.createConnection(db_config);
    context.client.servers = new context.discord.Collection();

    con.connect(function (err) {
        if (err) {
            console.log('Error connecting to database (retry in 2 seconds): ', err);
            setTimeout(init, 2000);
        } else {
            const start = Date.now();
            con.query('SELECT * FROM Servidores', (err, rows) => {
                if (err) throw err;
                if (rows.length >= 1) {
                    for (let x = 0; x < rows.length; x++) {
                        let cidd = typeof rows[x].cid === "string" && rows[x].cid === "null" ? null : rows[x].cid;
                        let IDD = rows[x].ID;
                        let prefixx = rows[x].prefix;
                        let lan = rows[x].lenguaje;
                        let serverConfig = {
                            channelId: cidd,
                            prefix: prefixx,
                            language: lan
                        };
                        context.client.servers.set(IDD, serverConfig);
                    }
                }
            });
            console.log(`Database loaded in ${Date.now() - start}ms.`);
        }
        setInterval(function () {
            con.query('SELECT * FROM Servidores')
            context.services.stats.verifyShrine(context);
        }, 5000);
    });

    con.on('error', function (err) {
        console.log('Data base error.', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            init();
            console.log('Trying to reconnect...');
        }
    });
}

function query(q, callback) {
    con.query(q, callback);
}

module.exports = {
    query: query,
    init: init
}