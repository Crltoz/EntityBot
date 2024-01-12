const mongoose = require('mongoose');

async function init() {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Connected to database.");
}

module.exports = {
    init: init
}