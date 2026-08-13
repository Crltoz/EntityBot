const mongoose = require('mongoose');

async function init() {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Connected to database.");
}

async function getOrCreateServer(guildId) {
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
    getOrCreateUser: getOrCreateUser,
    getDataSnapshot: getDataSnapshot,
    saveDataSnapshot: saveDataSnapshot
}