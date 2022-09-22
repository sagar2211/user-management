const mongoose = require("mongoose");


// user Schema
const userSchema = mongoose.Schema({
  name: String,
  email: String,
  gender: String,
  strength: String,
  about: String,
  password: String,
  role : {
    type : String,
    default : "normalUser"
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});



// export user schema
const User = mongoose.model("Users", userSchema);
module.exports.User = User;
module.exports.userSchema = userSchema;
