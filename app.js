require('dotenv').config({path:`${process.cwd()}/.env`})
const express = require('express')
const authrouter = require('./route/authRoute')
const app = express();
const port = process.env.APP_PORT || 4000

app.use(express.json()); // convert body to json 
app.get("/", (req,res)=>{
    res.status(200).json({
        status :"success",
        message:"REST API DONE"
    })
})

// all routes
app.use('/api/v1/auth', authrouter)



app.use("*", (req, res, next)=>{
    res.status(404).json({
        status:"fail",
        message:"Route Not Found"
    })
})
app.listen(port, ()=>{
    console.log(`The server is up and running on port ${port}`)
})