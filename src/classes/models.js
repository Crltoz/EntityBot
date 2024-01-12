const moongose = require('mongoose');

export const userdataSchema = moongose.Schema({
    _id: moongose.Schema.Types.ObjectId,
    discordID: String,
    steamID: String
});

export const serverSchema = moongose.Schema({
    _id: moongose.Schema.Types.ObjectId,
    serverID: String,
    channelID: String,
    language: Number,
});