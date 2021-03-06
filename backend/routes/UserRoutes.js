const express = require("express");
const route = express.Router();
var userDB = require("../model/user");
const validate = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const JWT = require("../Utilities/JWT_Auth");

//register
route.post("/register", async(req, res) => {
    let user;
    if (!req.body) {
        res.send({ status: 400, message: "content is empty. cannot be empty" });
        return;
    }
    //validate data
    const checked = validate.checkRegister(req.body);
    if (checked != true)
        return res.send({ status: 400, message: checked[0].message });

    //already exist?
    try {
        const emailExists = await userDB.findOne({ email: req.body.email });
        if (emailExists)
            return res.send({ status: 400, message: "Email already exists" });
    } catch (err) {
        res.status(400).send(err.message || "some error while sending to db");
    }

    try {
        const emailExists = await userDB.findOne({ username: req.body.username });
        if (emailExists)
            return res.send({ status: 400, message: "Username already exists." });
    } catch (err) {
        res.status(400).send(err.message || "some error while sending to db");
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    user = new userDB({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        username: req.body.username,
    });

    //save user to db

    user
        .save(user)
        .then(async(data) => {
            const token = JWT.GenerateJWT({ _id: data._id });
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.SENDER_EMAIL,
                    pass: process.env.SENDER_EMAIL_PASSWORD,
                },
            });
            let mailOptions = {
                from: process.env.SENDER_EMAIL, // sender address
                to: data.email, // list of receivers
                subject: "Verify email", // Subject line
                html: `<p>An account for ${process.env.HOST} was created using this email. <a href="https://${process.env.HOST}/verifyUser/${token}" >Click here </a>to verify the account.</p> <p>If the account was not created by you then you can ignore this email</p>. If the link is not clickable use this https://${process.env.HOST}/verifyUser/${token}`, // html body
            };
            await transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    res.send({ status: 500, message: err });
                } else {
                    res.send({
                        status: 200,
                        message: "Verification link send to email",
                    });
                }
            });
        })
        .catch((err) => {
            res.send({ status: 500, message: err.message });
        });
});

//login
route.post("/login", async(req, res) => {
    //validate data
    console.log(req.body);
    const checked = validate.checkLogin(req.body);
    if (checked != true)
        return res.send({
            status: 400,
            message: "Invalid input/too long/too short",
        });

    //already exist?
    const user = await userDB.findOne({ email: req.body.email });
    if (!user)
        return res.send({ status: 400, message: "No such email/password" });

    //has the password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass)
        return res.send({ status: 400, message: "No such email/password" });

    //create and give tokenes

    const token = JWT.GenerateJWT({
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        username: user.username,
    });

    try {
        if (user.verified) {
            res.send({ status: 200, user: user, token: token });
        } else {
            const token = JWT.GenerateJWT({ _id: user._id });
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.SENDER_EMAIL,
                    pass: process.env.SENDER_EMAIL_PASSWORD,
                },
            });
            let mailOptions = {
                from: process.env.SENDER_EMAIL, // sender address
                to: user.email, // list of receivers
                subject: "Verify email", // Subject line
                html: `<p>An account for ${process.env.HOST} was created using this email. <a href="https://${process.env.HOST}/verifyUser/${token}" >Click here </a>to verify the account.</p> <p>If the account was not created by you then you can ignore this email. If the link is not clickable use this https://${process.env.HOST}/verifyUser/${token}</p>`, // html body
            };
            await transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    res.send({ status: 500, message: err });
                } else {
                    res.send({
                        status: 400,
                        message: "You are not verified. Check email to verify",
                    });
                }
            });
        }
    } catch (err) {
        console.log(err);
        res.send({ status: 400, message: err.message });
    }
});

//to get all users
route.get("/all_users", (req, res) => {
    console.log("sending all users data");
    const token = req.headers.token;
    if (token && JWT.getUserData(token)) {
        const requestingUser = JWT.getUserData(token);
        if (requestingUser.isAdmin) {
            userDB
                .find()
                .then((user) => {
                    let users = [];
                    user.forEach((element) => {
                        if (element.verified) {
                            users.push(element);
                        }
                    });

                    res.send(users);
                })
                .catch((err) => {
                    res.status(500).send({
                        message: err.message || "some error while getting from db",
                    });
                });
        } else {
            res.send({ status: 400, message: "Classified action. Not admin" });
        }
    } else {
        res.send({ status: 400, message: "no token" });
    }
});

//to get one user
route.get("/single_user", (req, res) => {
    const token = req.headers.token;
    if (token && JWT.getUserData(token)) {
        const requestingUser = JWT.getUserData(token);
        const id = requestingUser._id;
        userDB
            .findById(id)
            .then((data) => {
                if (!data) {
                    res.send({ message: "didnt find the user with id" + id });
                } else {
                    res.send(data);
                }
            })
            .catch((err) => {
                res.send({ message: err + "err retrieving user with id" + id });
            });
    } else {
        res.send({ status: 400, message: "no token" });
    }
});

//delete
route.delete("/:id", (req, res) => {
    if (!req.body) {
        return res.send({
            status: 400,
            message: "Data to delete can not be empty",
        });
    }
    const token = req.headers.token;
    const id = req.params.id;
    const requestingUser = JWT.getUserData(token);

    if (requestingUser.isAdmin) {
        userDB
            .findById(id)
            .then((data) => {
                if (!data) {
                    res.send({
                        status: 400,
                        message: "didnt find the user with id" + id,
                    });
                } else {
                    if (!data.isAdmin) {
                        //update user
                        userDB
                            .findByIdAndDelete(id)
                            .then((data) => {
                                if (!data) {
                                    res.send({
                                        status: 400,
                                        message: `cannot delete with ${id}.maybe not found`,
                                    });
                                } else {
                                    res.send({
                                        status: 200,
                                        message: "deleted succesfully",
                                    });
                                }
                            })
                            .catch((err) => {
                                res.status(500).send({ message: "error in deleting" });
                            });
                    } else {
                        res.send({ status: 400, message: "cannot delete a admin" });
                    }
                }
            })
            .catch((err) => {
                res
                    .status(500)
                    .send({ message: err + "err retrieving user with id" + id });
            });
    } else {
        res.send({ status: 400, message: "Classified action. Not admin" });
    }
});

//update role
route.put("/updateRole/:id", (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Data to update can not be empty" });
    }

    const token = req.headers.token;
    const id = req.params.id;
    const requestingUser = JWT.getUserData(token);

    if (requestingUser.isAdmin) {
        userDB
            .findById(id)
            .then((data) => {
                if (!data) {
                    res.status(404).send({ message: "didnt find the user with id" + id });
                } else {
                    if (!data.isAdmin) {
                        //update user
                        userDB
                            .findByIdAndUpdate(id, req.body, {
                                useFindAndModify: false,
                            })
                            .then((data) => {
                                if (!data) {
                                    res.status(400).send({
                                        message: `cannot update with ${id}.maybe not found`,
                                    });
                                } else {
                                    res.send({ message: "Made admin" });
                                }
                            })
                            .catch((err) => {
                                res.status(500).send({ message: "error in updating" });
                            });
                    } else {
                        res.send({ message: "an admin cannot be made into user" });
                    }
                }
            })
            .catch((err) => {
                res
                    .status(500)
                    .send({ message: err + "err retrieving user with id" + id });
            });
    } else {
        res.send({ status: 400, message: "invalid token" });
    }
});

//update user
route.put("/update/:id", (req, res) => {
    if (!req.body) {
        return res.status(400).send({ message: "Data to update can not be empty" });
    }
    const token = req.headers.token;
    const id = req.params.id;
    const requestingUser = JWT.getUserData(token);
    if (requestingUser.isAdmin) {
        userDB
            .findByIdAndUpdate(id, req.body, { useFindAndModify: false })
            .then((data) => {
                if (!data) {
                    res.status(400).send({
                        message: `cannot update with ${id}.maybe not found`,
                    });
                } else {
                    res.send({ message: "User approved" });
                }
            })
            .catch((err) => {
                res.status(500).send({ message: "error in updating" });
            });
    } else {
        res.send({ status: 400, message: "invalid token" });
    }
});

//forgot password mail
route.put("/forgotPassword/:email", async(req, res) => {
    if (req.params.email) {
        const User = await userDB.findOne({ email: req.params.email });
        if (User) {
            const token = JWT.GenerateJWT({ _id: data._id });
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.SENDER_EMAIL,
                    pass: process.env.SENDER_EMAIL_PASSWORD,
                },
            });
            let mailOptions = {
                from: process.env.SENDER_EMAIL, // sender address
                to: req.params.email, // list of receivers
                subject: "Password reset", // Subject line
                html: `<a href="https://${process.env.HOST}/resetPassword/${token}" >Click here to reset password. OR copy this link https://${process.env.HOST}/resetPassword/${token}</a>`, // html body
            };
            await transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    res.send({ status: 500, message: err });
                } else {
                    res.send({
                        status: 200,
                        message: "password reset link send to mail ",
                    });
                }
            });
        } else {
            res.send({ status: 400, message: "no such email in database" });
        }
    } else {
        res.send({ status: 400, message: "no email in url" });
    }
});

//mail password reset link
route.get("/mailResetPassword", async(req, res) => {
    const token = req.headers.token;

    if (token && JWT.getUserData(token)) {
        const id = JWT.getUserData(token)._id;

        //finding mail that has same id as user
        userDB
            .findById(id)
            .then(async(data) => {
                if (!data) {
                    res.status(404).send({ message: "didnt find the user with id" + id });
                } else {
                    let transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: process.env.SENDER_EMAIL,
                            pass: process.env.SENDER_EMAIL_PASSWORD,
                        },
                    });
                    let mailOptions = {
                        from: process.env.SENDER_EMAIL, // sender address
                        to: data.email, // list of receivers
                        subject: "Password reset", // Subject line

                        html: `<a href="https://${process.env.HOST}/resetPassword/${token}" >Click here to reset password. or copy this link https://${process.env.HOST}/resetPassword/${token}</a>`, // html body
                    };
                    await transporter.sendMail(mailOptions, (err, info) => {
                        if (err) {
                            res.send({ status: 500, message: err });
                        } else {
                            res.send({
                                status: 200,
                                message: "reset link send to mail " + info.response,
                            });
                        }
                    });
                }
            })
            .catch((err) => {
                res
                    .status(500)
                    .send({ message: err + "err retrieving user with id" + id });
            });
    } else {
        res.send({ status: 400, message: "no token" });
    }
});

// password reset to database
route.put("/changePassword", async(req, res) => {
    const token = req.headers.token;

    if (token && JWT.getUserData(token)) {
        const id = JWT.getUserData(token)._id;
        userDB
            .findById(id)
            .then(async(data) => {
                if (!data) {
                    res.status(404).send({ message: "didnt find the user with id" + id });
                } else {
                    const salt = await bcrypt.genSalt(10);
                    const hashPassword = await bcrypt.hash(req.body.password, salt);
                    let user = data;
                    user.password = hashPassword;
                    userDB
                        .findByIdAndUpdate(id, user, { useFindAndModify: false })
                        .then((data) => {
                            if (!data) {
                                res.status(400).send({
                                    message: `cannot update with ${id}.maybe not found`,
                                });
                            } else {
                                res.send({ message: "Password changed" }); //final message if everything works
                            }
                        })
                        .catch((err) => {
                            res.status(500).send({ message: "error in updating" });
                        });
                }
            })
            .catch((err) => {
                res
                    .status(500)
                    .send({ message: err + "err retrieving user with id" + id });
            });
    } else {
        res.send({ status: 400, message: "no token" });
    }
});

//verify user (link send to mail(to be clicked))
route.get("/verifyUser/:token", async(req, res) => {
    const token = req.params.token;

    if (token && JWT.getUserData(token)) {
        const id = JWT.getUserData(token)._id;
        userDB
            .findById(id)
            .then(async(data) => {
                if (!data) {
                    res.status(404).send({ message: "didnt find the user with id" + id });
                } else {
                    let user = data;
                    user.verified = true;
                    userDB
                        .findByIdAndUpdate(id, user, { useFindAndModify: false })
                        .then((data) => {
                            if (!data) {
                                res.status(400).send({
                                    message: `cannot update with ${id}.maybe not found`,
                                });
                            } else {
                                res.send({ message: "User verified. You can login now" }); //final message if everything works
                            }
                        })
                        .catch((err) => {
                            res.status(500).send({ message: "error in updating" });
                        });
                }
            })
            .catch((err) => {
                res
                    .status(500)
                    .send({ message: err + "err retrieving user with id" + id });
            });
    } else {
        res.send({ status: 400, message: "no token" });
    }
});

route.get("/search/:query", async(req, res) => {
    const query = req.params.query;
    try {
        let result = await userDB.aggregate([{
            $search: {
                index: "searchForUsers1",
                text: {
                    query: query,
                    path: {
                        wildcard: "*",
                    },
                },
            },
        }, ]);

        res.send(result);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
});

//set dp
route.post("/uploadDP", (req, res) => {
    const token = req.headers.token;
    if (token && JWT.getUserData(token)) {
        const requestingUser = JWT.getUserData(token);
        const id = requestingUser._id;
        userDB
            .findByIdAndUpdate(id, { dp_url: req.body.dp_url })
            .then((data) => {
                if (!data) {
                    res.send({ message: "didnt find the user with id" + id });
                } else {
                    res.send({ message: "Profile Picture Updated" });
                }
            })
            .catch((err) => {
                res.send({ message: err + "err retrieving user with id" + id });
            });
    } else {
        res.send({ status: 400, message: "no token" });
    }
});

route.get("/single_user_with_id/:id", (req, res) => {
    const id = req.params.id;
    if (id) {
        userDB
            .findById(id)
            .then((data) => {
                if (!data) {
                    res.send({ message: "didnt find the user with id" + id });
                } else {
                    res.send(data);
                }
            })
            .catch((err) => {
                res.send({ message: err + "err retrieving user with id" + id });
            });
    } else {
        res.send({ status: 400, message: "no token" });
    }
});

route.get("/sendRequest/:id", (req, res) => {
    const token = req.headers.token;
    if (token && JWT.getUserData(token)) {
        const requestingUser = JWT.getUserData(token);
        const id = requestingUser._id;
        const idOfReciver = req.params.id;
        if (idOfReciver) {
            userDB
                .findByIdAndUpdate(idOfReciver, { $push: { friend_request: id } })
                .then((data) => {
                    if (!data) {
                        res.send({ message: "didnt find the user with id" + idOfReciver });
                    } else {
                        res.send({ message: "Request send" });
                    }
                })
                .catch((err) => {
                    res.send({
                        message: err + "err retrieving user with id" + idOfReciver,
                    });
                });
        }
    } else {
        res.send({ status: 400, message: "no token" });
    }
});

route.get("/acceptRequest/:id", (req, res) => {
    const token = req.headers.token;
    if (token && JWT.getUserData(token)) {
        const requestingUser = JWT.getUserData(token);
        const id = requestingUser._id;
        const idOfReciver = req.params.id;
        if (idOfReciver) {
            userDB
                .findByIdAndUpdate(idOfReciver, { $push: { friends: id } })
                .then((data) => {
                    if (!data) {
                        res.send({ message: "Didnt find the user,maybe user was deleted" });
                        return;
                    } else {
                        userDB
                            .findByIdAndUpdate(id, {
                                $push: { friends: idOfReciver },
                                $pull: { friend_request: idOfReciver },
                            })
                            .then((data) => {
                                if (!data) {
                                    res.send({
                                        message: "didnt find the user with id" + idOfReciver,
                                    });
                                } else {
                                    res.send({ message: "Request Accepted" });
                                }
                            })
                            .catch((err) => {
                                res.send({
                                    message: err + "err retrieving user with id" + idOfReciver,
                                });
                            });
                    }
                })
                .catch((err) => {
                    res.send({
                        message: err + "err retrieving user with id" + idOfReciver,
                    });
                });
        }
    } else {
        res.send({ status: 400, message: "no token" });
    }
});

route.get("/rejectRequest/:id", (req, res) => {
    const token = req.headers.token;
    if (token && JWT.getUserData(token)) {
        const requestingUser = JWT.getUserData(token);

        const id = requestingUser._id;
        const idOfReciver = req.params.id;
        if (idOfReciver) {
            userDB
                .findByIdAndUpdate(id, { $pull: { friend_request: idOfReciver } })
                .then((data) => {
                    if (!data) {
                        res.send({
                            message: "didnt find the user with id" + idOfReciver,
                        });
                    } else {
                        res.send({ message: "Request Rejected" });
                    }
                })
                .catch((err) => {
                    res.send({
                        message: err + "err retrieving user with id" + idOfReciver,
                    });
                });
        }
    } else {
        res.send({ status: 400, message: "no token" });
    }
});

route.get("/removeFriend/:id", (req, res) => {
    const token = req.headers.token;
    if (token && JWT.getUserData(token)) {
        const requestingUser = JWT.getUserData(token);
        const id = requestingUser._id;
        const idOfReciver = req.params.id;
        if (idOfReciver) {
            userDB
                .findByIdAndUpdate(idOfReciver, { $pull: { friends: id } })
                .then((data) => {
                    if (!data) {
                        res.send({ message: "Didnt find the user,maybe user was deleted" });
                        return;
                    } else {
                        userDB
                            .findByIdAndUpdate(id, {
                                $pull: { friends: idOfReciver },
                            })
                            .then((data) => {
                                if (!data) {
                                    res.send({
                                        message: "didnt find the user with id" + idOfReciver,
                                    });
                                } else {
                                    res.send({ message: "Friend Removed" });
                                }
                            })
                            .catch((err) => {
                                res.send({
                                    message: err + "err retrieving user with id" + idOfReciver,
                                });
                            });
                    }
                })
                .catch((err) => {
                    res.send({
                        message: err + "err retrieving user with id" + idOfReciver,
                    });
                });
        }
    } else {
        res.send({ status: 400, message: "no token" });
    }
});

route.get("/friends", async(req, res) => {
    const token = req.headers.token;
    if (token && JWT.getUserData(token)) {
        const requestingUser = JWT.getUserData(token);
        const id = requestingUser._id;
        try {
            const requestingUserData = await userDB.findById(id);
            if (!requestingUserData) {
                res.send({ message: "Didnt find the user with id" + id });
                return;
            }
            if (requestingUserData.friends.length) {
                let friendsData = [];
                for (let i = 0; i < requestingUserData.friends.length; i++) {
                    const friendData = await userDB.findById(
                        requestingUserData.friends[i]
                    );
                    if (friendData) friendsData.push(friendData);
                }
                res.send({ friendsData: friendsData });
            } else {
                res.send({ friendsData: false });
            }
        } catch (error) {
            res.send({ message: err + "err retrieving user with id" + id });
        }
    } else {
        res.send({ status: 400, message: "no token" });
    }
});

module.exports = route;