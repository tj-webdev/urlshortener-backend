const express = require('express');
const userController = require('../controllers/userController');

// check user is logged in or not middleware
const {isLoggedIn} = require('../middlewares/userAuth');

// data validation schema and middlewares
const {loginSchema, registerSchema, validator} = require('../middlewares/userValidator');

const router = express.Router();

router
  .post('/login', validator(loginSchema), userController.login)
  .post('/register', validator(registerSchema), userController.register)
  .get('/logout', userController.logout)
  .get('/isloggedin', isLoggedIn);


module.exports = router;