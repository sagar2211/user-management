const express = require('express')
const router = express.Router();
const { createNewUser, updateUser, deleteUser, getAllUser, getUser, searchUser, loginUser, logoutUser } = require('../controllers/userController');
const { userDataValidateChainMethod, userLoginValidate, searchDataValidate } = require('../UserValidator');
const { verifyToken } = require("../libs/generateToken");

// create User
router.post('/create',userDataValidateChainMethod, createNewUser);

// update User
router.post('/update', verifyToken, updateUser);

// delete user
router.delete('/delete/:id', verifyToken, deleteUser);

// get All User
router.post('/all', verifyToken, getAllUser);

// get User
router.get('/:id', getUser);

// search User
router.post('/searchUser', verifyToken, searchDataValidate, searchUser);

// create User
router.post('/login',userLoginValidate, loginUser);

// logout User
router.post('/logout',verifyToken, logoutUser);


module.exports = router;