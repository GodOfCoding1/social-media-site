const mongoose = require("mongoose");

var shared_posts = new mongoose.Schema({
    from: { type: String, require: true },
    post_id: { type: String, require: true },
});

var schme = new mongoose.Schema({
    name: { type: String, require: true },
    username: { type: String, require: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    isAdmin: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    posts: [{ type: String }],
    friends: [{ type: String }],
    coins: { type: Number, default: 100 },
    shared_post: [{ type: shared_posts }],
    dp_url: { type: String, default: "" },
});

const userDB = mongoose.model("userDB", schme);

module.exports = userDB;