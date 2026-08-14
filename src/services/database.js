const mongoose = require('mongoose');

async function init() {
    // useNewUrlParser/useUnifiedTopology were dropped in the driver mongoose 8 ships with.
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database.");
}

// Every interaction asks for the server config, and the handler often asks a second and third
// time down the call chain. Caching the *promise* collapses those into one round-trip and also
// prevents two concurrent commands in a fresh guild from both inserting the document.
// The cached value is the live mongoose document, so a caller that mutates and saves it is
// immediately visible to the next reader; the TTL only exists to pick up edits made elsewhere.
const SERVER_CACHE_TTL = 10 * 60 * 1000;
const serverCache = new Map();

async function loadServer(guildId) {
    let serverConfig = await serverModel.findOne({ _id: guildId });
    if (serverConfig) return serverConfig;
    serverConfig = new serverModel({
        _id: guildId,
        channelID: "",
        language: 0
    });
    await serverConfig.save();
    return serverConfig;
}

function getOrCreateServer(guildId) {
    const cached = serverCache.get(guildId);
    if (cached && cached.expiresAt > Date.now()) return cached.promise;

    const promise = loadServer(guildId).catch((err) => {
        // A failed lookup must not be remembered, or the guild stays broken until the TTL.
        serverCache.delete(guildId);
        throw err;
    });
    serverCache.set(guildId, { promise: promise, expiresAt: Date.now() + SERVER_CACHE_TTL });
    return promise;
}

/**
 * @param {String} guildId - Guild id.
 * @description Drop a guild from the cache, so a guild that removes and re-adds the bot
 *              does not answer from a stale document.
 */
function forgetServer(guildId) {
    serverCache.delete(guildId);
}

async function getOrCreateUser(memberId) {
    let userConfig = await userdataModel.findOne({ _id: memberId });
    if (userConfig) return userConfig;
    userConfig = new userdataModel({
        _id: memberId,
        steamID: ""
    });
    await userConfig.save();
    return userConfig;
}

/**
 * @param {String} name - Snapshot name ("perks", "characters" or "dlc").
 * @description Read the last snapshot stored for an API endpoint, or null if there is none.
 */
async function getDataSnapshot(name) {
    return dataCacheModel.findOne({ _id: name });
}

/**
 * @param {String} name - Snapshot name ("perks", "characters" or "dlc").
 * @param {Object} payload - Raw API response.
 * @description Store a snapshot so the bot survives a restart while the API is down.
 */
async function saveDataSnapshot(name, payload) {
    await dataCacheModel.updateOne(
        { _id: name },
        { $set: { payload: JSON.stringify(payload), updatedAt: new Date() } },
        { upsert: true }
    );
}

const userdataSchema = mongoose.Schema({
    _id: String,
    steamID: String
}, {
    versionKey: false
});

const serverSchema = mongoose.Schema({
    _id: String,
    channelID: String,
    language: Number,
}, {
    versionKey: false
});

// The payload is kept as a JSON string on purpose: the API keys are arbitrary
// ("Ace_In_The_Hole", "Monitor_&_Abuse"), and storing them as document fields would
// put us at the mercy of Mongo's field-name rules.
const dataCacheSchema = mongoose.Schema({
    _id: String,
    payload: String,
    updatedAt: Date
}, {
    versionKey: false
});

const userdataModel = mongoose.model("userdata", userdataSchema);
const serverModel = mongoose.model("server", serverSchema);
const dataCacheModel = mongoose.model("datacache", dataCacheSchema);

module.exports = {
    init: init,
    userdataSchema: userdataModel,
    serverSchema: serverModel,
    getOrCreateServer: getOrCreateServer,
    forgetServer: forgetServer,
    getOrCreateUser: getOrCreateUser,
    getDataSnapshot: getDataSnapshot,
    saveDataSnapshot: saveDataSnapshot
}