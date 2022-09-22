const { User } = require("../model/userModel");
var _ = require("lodash");
const { validationResult } = require("express-validator");
const bcryptLib = require("../libs/bcryptLib");
const { generateAuthToken, verifyToken } = require("../libs/generateToken");

// create new user
exports.createNewUser = async (req, res) => {
  const errors = validationResult(req);

  // if there is error then return Error
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  const user = req.body;
  const password = await bcryptLib.generateHashedPassword(user.password);
  const newUser = new User({
    name: user.name,
    email: user.email,
    gender: user.gender,
    strength: user.strength,
    about: user.about,
    password: password,
  });

  try {
    let isExist = await isUserAlreadyExist(req.body.email);
    if (_.isEmpty(isExist)) {
      const data = await newUser.save();
      let obj = {
        success: true,
        data: data,
        message: "User created successfully..",
      };
      res.status(200).send(obj);
    } else {
      let obj = {
        message: "User already Exists.",
        success: false,
      };
      res.status(500).send(obj);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

// login user
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  // if there is error then return Error
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  try {
    const data = await User.findOne({ email: req.body.email });

    if (data) {
      let isValidPassword = await bcryptLib.isPasswordRight(
        req.body.password,
        data.password
      );
      if (isValidPassword) {
        const token = generateAuthToken(data);
        let obj = {
          message: "Login Successfully.",
          success: true,
          token: token,
          data: data,
        };
        res.status(200).send(obj);
      } else {
        let obj = {
          message: "Invalid username or password.",
          success: false,
        };
        res.status(500).send(obj);
      }
    } else {
      let obj = {
        message: "Invalid username or password.",
        success: false,
      };
      res.status(500).send(obj);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// update user
exports.updateUser = async (req, res) => {
  var updateObject = req.body;
  try {
    let id = req.body._id;
    let data = await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name: updateObject.name,
          email: updateObject.email,
          lastname: updateObject.gender,
          strength: updateObject.strength,
          about: updateObject.about,
        },
      },
      { new: true }
    );
    let obj = {
      success: true,
      data: data,
      message: "User updated successfully..",
    };
    res.status(200).send(obj);
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

// delete user
exports.deleteUser = async (req, res) => {
  try {
    let data = await User.findByIdAndDelete(req.params.id);
    let obj = {
      success: true,
      data: data,
      message: "User deleted successfully..",
    };
    res.status(200).send(obj);
  } catch (error) {
    res.status(500).send(error);
  }
};

// get all user
exports.getAllUser = async (req, res) => {
  
  try {
    let pageNumber = parseInt(req.body.pageNumber);
    let size = parseInt(req.body.size);

    const data = await User.find({ role: { $nin: ["admin"] } });
    let totalRecords = data.length;
    var finalData = [];
    for (let i = size * (pageNumber - 1); i < size * pageNumber; i++) {
      if (data[i]) finalData.push(data[i]);
    }
    let obj = {
      success: true,
      data: finalData,
      totalRecords: totalRecords,
      message: "All user fetch successfully..",
    };
    res.status(200).send(obj);
  } catch (err) {
    res.status(500).send(err);
  }
};

// get user info
exports.getUser = async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    let obj = {
      success: true,
      data: data,
      message: "User fetch successfully..",
    };
    res.status(200).send(obj);
  } catch (err) {
    res.status(500).send(err);
  }
};

async function isUserAlreadyExist(email) {
  try {
    const data = await User.find({ email: email });
    return data;
  } catch (err) {
    console.log(err);
  }
}

// search user info
exports.searchUser = async (req, res) => {
  const errors = validationResult(req);

  // if there is error then return Error
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  let searchObj = req.body;
  let data = {};
  let obj = {};
  let pageNumber = parseInt(searchObj.pageNumber);
  let size = parseInt(searchObj.size);

  try {
    let totalRecords;
    var finalData = [];
    if (searchObj.searchType == "id") {
      finalData = await User.find({ _id: searchObj.searchText });
    } else if (searchObj.searchType == "name") {
      data = await User.find({
        name: {
          $regex: new RegExp("^" + searchObj.searchText.toLowerCase(), "i"),
        },
      });
      totalRecords = data.length
      for (let i = size * (pageNumber - 1); i < size * pageNumber; i++) {
        if (data[i]) 
        finalData.push(data[i]);
      }
    }
    if (finalData.length) {
      obj = {
        success: true,
        data: finalData,
        totalRecords: totalRecords,
        message: "User search successfully..",
      };
    } else {
      obj = {
        success: true,
        data: finalData,
        message: "Record not found..",
      };
    }
    res.status(200).send(obj);
  } catch (err) {
    res.status(500).send(err);
  }
};

//logout user
exports.logoutUser = (req,res) =>{
  const token = generateAuthToken(req.body);
  obj = {
    success: true,
    message: "Logout successfully..",
  };
  res.status(200).send(obj);
}