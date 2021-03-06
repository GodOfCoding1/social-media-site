const jwt = require("jsonwebtoken");

const JWTAuthMiddleware = function(req, res, next) {
    try {
        console.log(
            "\n-----[JWT MiddleWare] JWT Middleware " +
            req.url +
            "  ip= " +
            req.connection.remoteAddress
        );
        if (
            req.url == "/users/login" ||
            req.url == "/users/register" ||
            req.url.includes("/users/forgotPassword/") ||
            req.url.includes("/users/verifyUser/") ||
            req.url.includes("/payment/verification")
        ) {
            next();
        } else if (
            req.url.includes("/users/") ||
            req.url.includes("/invoices/") ||
            req.url.includes("/payment/")
        ) {
            const token = req.headers.token;
            if (!token || token === "" || token.includes("object")) {
                console.log("[JWT MiddleWare] No token found");
                res.status(401).send("Unauthorized: Token not found ");
            } else {
                console.log("[JWT MiddleWare] token found");
                jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
                    if (err) {
                        console.log(
                            "[JWT MiddleWare] user is not autherised. Error :",
                            err
                        );
                        res.status(401).send("Unauthorized: Invalid token");
                    } else {
                        console.log(
                            "[JWT MiddleWare] user is autherised " +
                            JSON.stringify(decoded.userData)
                        );
                        req.headers.userData = decoded.userData;
                        next();
                    }
                });
            }
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
    }
};

const GenerateJWT = function(data) {
    try {
        var user = { userData: data };
        payload = user;
        token = jwt.sign(payload, process.env.TOKEN_SECRET);
        return token;
    } catch (error) {
        console.log(error);
    }
};

const getUserData = (token) => {
    try {
        return jwt.verify(token, process.env.TOKEN_SECRET).userData;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    JWTAuthMiddleware,
    GenerateJWT,
    getUserData,
};