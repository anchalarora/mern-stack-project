const crypto = require("crypto");
const secret = crypto.randomBytes(64).toString("hex");
console.log(secret);

// Generate a secret for access token
const accessTokenSecret = crypto.randomBytes(64).toString("hex");
console.log("ACCESS_TOKEN_SECRET:", accessTokenSecret);

// Generate a secret for refresh token
const refreshTokenSecret = crypto.randomBytes(64).toString("hex");
console.log("REFRESH_TOKEN_SECRET:", refreshTokenSecret);
