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

const userdataModel = mongoose.model("userdata", userdataSchema);
const serverModel = mongoose.model("server", serverSchema);

module.exports = {
    init: init,
    userdataSchema: userdataModel,
    serverSchema: serverModel,
    getOrCreateServer: getOrCreateServer,
    getOrCreateUser: getOrCreateUser
}