const express = require("express");
const route = express.Router();
const userDB = require("../model/user");
const postDB = require("../model/post");
const JWT = require("../Utilities/JWT_Auth");

route.post("/addPost", async(req, res) => {
    const token = req.headers.token;

    if (token) {
        const id = JWT.getUserData(token)._id;
        console.log("inside post", {...req.body, user_id: id });
        let post_result = new postDB({...req.body, user_id: id });

        post_result
            .save()
            .then((post_data) => {
                userDB
                    .findByIdAndUpdate(id, { $push: { posts: post_data._id } })
                    .then((data) => {
                        if (!data) {
                            res.send({
                                message: `Cannot find user in database`,
                            });
                        } else {
                            res.send({ message: "Post added" }); //final message if everything works
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        res.send({ message: "Error in adding" });
                    });
            })
            .catch((err) => {
                console.log(err);
                res.send({ message: "Error in adding" });
            });
    } else {
        res.send({ message: "You are not logged in" });
    }
});

route.get("/allposts/:id", async(req, res) => {
    const token = req.headers.token;
    let id = JWT.getUserData(token)._id;
    if (req.params.id !== ":id") {
        id = req.params.id;
    }
    if (token) {
        try {
            if (id) {
                const user = await userDB.findById(id);
                if (user.posts.length) {
                    const postID_array = user.posts;
                    let array_of_posts = [];
                    for (let i = 0; i < postID_array.length; i++) {
                        try {
                            const post = await postDB.findById(postID_array[i]);
                            if (post) {
                                array_of_posts.push(post);
                            }
                        } catch (error) {
                            throw error;
                        }
                    }
                    res.send({
                        status: 200,
                        user: user,
                        posts: array_of_posts,
                        havePosts: true,
                    });
                } else {
                    res.send({
                        user: user,
                        posts: user.posts,
                        havePosts: false,
                    });
                }
                return;
            }
        } catch (error) {
            console.log(error);
            res.send({ message: "Error with database" });
            return;
        }
    }

    res.send({ message: "Some issue with the token send" });
});

module.exports = route;