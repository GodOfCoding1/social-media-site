const express = require("express");
const route = express.Router();
const userDB = require("../model/user");
const postDB = require("../model/post");
const JWT = require("../Utilities/JWT_Auth");

route.post("/addPost", async(req, res) => {
    const token = req.headers.token;

    if (token) {
        const poster = JWT.getUserData(token);
        if (JWT.getUserData(token)) {
            let post_result = new postDB({
                ...req.body,
                user_id: poster._id,
                username: poster.username,
            });

            post_result
                .save()
                .then((post_data) => {
                    userDB
                        .findByIdAndUpdate(poster._id, { $push: { posts: post_data._id } })
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
        }
    } else {
        res.send({ message: "You are not logged in" });
    }
});

route.get("/allposts/:id", async(req, res) => {
    const token = req.headers.token;
    if (JWT.getUserData(token)) {
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
                        array_of_posts.sort(function(a, b) {
                            return (
                                parseFloat(new Date(b.time).getTime()) -
                                parseFloat(new Date(a.time).getTime())
                            );
                        });

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
    }

    res.send({ message: "Some issue with the token send" });
});

route.get("/deletePost/:id", async(req, res) => {
    const token = req.headers.token;
    const postid = req.params.id;

    if (token) {
        if (JWT.getUserData(token)) {
            const id = JWT.getUserData(token)._id;

            try {
                const user_with_post = await userDB.find({
                    _id: id,
                    posts: { $in: [postid] },
                });

                if (user_with_post) {
                    await userDB.findOneAndUpdate({
                        _id: id,
                    }, { $pull: { posts: postid } });

                    const post_deleted = await postDB.findByIdAndDelete(postid);
                    if (post_deleted) {
                        res.send({ message: "Post Deleted" });
                    }
                } else {
                    res.send({
                        message: `Cannot find user in database`,
                    });
                }
            } catch (error) {
                console.log(error);
                res.send({ message: "Error in Deleting" });
            }
        }
    } else {
        res.send({ message: "You are not logged in" });
    }
});

route.get("/likePost/:id", async(req, res) => {
    const token = req.headers.token;
    const postid = req.params.id;

    if (token) {
        const requestingUser = JWT.getUserData(token);
        if (requestingUser) {
            const id = requestingUser._id;
            try {
                const post_liked = await postDB.findByIdAndUpdate(postid, {
                    $inc: { likes: 1 },
                    $addToSet: { liked_by: id },
                });
                await userDB.findByIdAndUpdate(post_liked.user_id, {
                    $inc: { coins: 1 },
                });

                if (post_liked) {
                    res.send({ liked: post_liked.likes });
                }
            } catch (error) {
                console.log(error);
                res.send({ message: "Error in Liking" });
            }
        }
    } else {
        res.send({ message: "You are not logged in" });
    }
});

route.get("/unlockPost/:id", async(req, res) => {
    const token = req.headers.token;
    const postid = req.params.id;

    if (token) {
        const requestingUser = JWT.getUserData(token);
        const id = requestingUser._id;
        try {
            const requestingUserData = await userDB.findById(id);
            const post = await postDB.findById(postid);

            if (post && requestingUserData) {
                if (requestingUserData.coins - post.coins_needed >= 0) {
                    await postDB.findByIdAndUpdate(postid, {
                        $inc: { coins_earned: post.coins_needed },
                        $addToSet: { unlocked_by: id },
                    });
                    await userDB.findByIdAndUpdate(post.user_id, {
                        $inc: { coins: post.coins_needed },
                    });
                    await userDB.findByIdAndUpdate(id, {
                        coins: requestingUserData.coins - post.coins_needed,
                    });
                    res.send({ unlocked: true });
                } else {
                    res.send({ message: "Insufficent coins" });
                }
            } else {
                res.send({ message: "Cannot find requesting user/post in database" });
            }
        } catch (error) {
            console.log(error);
            res.send({ message: "Error in Liking" });
        }
    } else {
        res.send({ message: "You are not logged in" });
    }
});

route.get("/getFeed", async(req, res) => {
    const token = req.headers.token;
    if (token) {
        const requestingUser = JWT.getUserData(token);
        if (requestingUser) {
            const id = requestingUser._id;
            userDB
                .findById(id)
                .then(async(data) => {
                    if (!data) {
                        res.send({
                            message: "didnt find the user with id" + id,
                        });
                        return;
                    } else {
                        let allPostsID = [];
                        for (let i = 0; i < data.friends.length; i++) {
                            try {
                                const friendData = await userDB.findById(data.friends[i]);
                                if (friendData)
                                    allPostsID.push(
                                        ...JSON.parse(JSON.stringify(friendData.posts))
                                    );
                            } catch (error) {
                                console.log(error);
                            }
                        }

                        let allPostData = [];

                        for (let i = 0; i < allPostsID.length; i++) {
                            try {
                                const postData = await postDB.findById(allPostsID[i]);
                                if (postData)
                                    allPostData.push(JSON.parse(JSON.stringify(postData)));
                            } catch (error) {
                                console.log(error);
                            }
                        }

                        allPostData.sort(function(a, b) {
                            return (
                                parseFloat(new Date(b.time).getTime()) -
                                parseFloat(new Date(a.time).getTime())
                            );
                        });

                        res.send({ feed: allPostData });
                    }
                })
                .catch((err) => {
                    res.send({
                        message: err + "err retrieving user with id" + id,
                    });
                });
        }
    } else {
        res.send({ status: 400, message: "no token" });
    }
});

module.exports = route;