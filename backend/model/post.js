const mongoose = require("mongoose");

var schme = new mongoose.Schema({
    likes: { type: Number, default: 0 },
    type: { type: String, require: true, default: "" },
    text: { type: String, default: "" },
    caption: { type: String, default: "" },
    image_url: { type: String, default: "" },
    user_id: { type: String, default: "" },
    coins_needed: { type: Number, default: 0 },
    coins_earned: { type: Number, default: 0 },
});

const Posts = mongoose.model("Posts", schme);

module.exports = Posts;