const user = require("../db/models/user")
const jwt = require("jsonwebtoken")
require('dotenv').config({path:`${process.cwd()}/.env`})
const bcrypt = require("bcrypt")

function generateToken(payload){
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn:process.env.JWT_EXPIRES_IN
    })
}

const signupController = async(req, res, next) =>{
    const body = req.body;

    if(!["seller","buyer"].includes(body.userType)){
        // only seller and buyers can create new accounts 
        return res.status(400).json({
            status: 'fail',
            message: 'Invalid user Type' 
        })
    }

    const newUser = await user.create({
        userType:body.userType,
        firstName:body.firstName,
        lastName:body.lastName,
        email:body.email,
        password:body.password,
        confirmPassword:body.confirmPassword
    })

    const result  = newUser.toJSON()

    delete result.password;
    delete result.deletedAt;

    result.token = generateToken({
        id: result.id
    })

    if(!result){
        return res.status(400).json({
            status:'fail',
            message:'Failed to create the user'
        })
    }

    return res.status(201).json({
        status:"success",
        data: result
    })

}


const loginController = async(req, res, next)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            status:'fail',
            message:"Please provide email and password"
        })
    }

    const result = await user.findOne({where:{email}})
    if(!result){
        return res.status(401).json({
            status:'fail',
            message:"Incorrect email or password"
        })
    }

    const isPasswordMatched = await bcrypt.compare(password, result.password)
    if(!isPasswordMatched){
        return res.status(401).json({
            status:'fail',
            message:"Incorrect email or passwordd"
        })
    }

    const token = generateToken({
        id: result.id
    })

    return res.json({
        status:"success",
        token
    })

}

module.exports = {signupController, loginController}