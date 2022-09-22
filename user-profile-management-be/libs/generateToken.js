const jwt = require("jsonwebtoken");

exports.generateAuthToken = function (user) {
  const info = {
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, //1 day
    Data: {
      userId: user._id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      password: user.password,
      role: user.role,
    },
  };
  return jwt.sign(info, process.env.JWTSECRET);
};

exports.verifyToken = function (req,res,next) {
  let token = req.header("authorization");
  var authorization = token.split(" ")[1],
    decoded;
  let userData = jwt.verify(authorization, process.env.JWTSECRET);
  if (userData.Data.role === "admin") {
    next();
  } else {
    res.status(401).send("Unautherised User");
  }
};
