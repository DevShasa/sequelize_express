// signup logging etc
const router = require('express').Router();
const {signupController, loginController} = require('../controller/authController')

router.route('/signup').post(signupController) // api/v1/auth/signup
router.route('/login').post(loginController)
module.exports =  router