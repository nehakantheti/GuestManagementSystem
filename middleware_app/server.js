const express = require("express");
const path = require("path");
const fs = require("fs")

const app = express();
const port = process.env.PORT||3000;

app.use(function(req,res,next){
    console.log("Request Date:"+ new Date());
    // res.sendFile("./static/cool.txt");
    next()
})

app.use(function(req,res,next){
    var filepath = path.join(__dirname,"static",req.url)
    fs.stat(filepath,function(err,fileInfo){
        if(err){
            next();
            return
        }
        if(fileInfo.isFile()){
            res.sendFile(filepath);
        }else{
            next()
        }
    })
})

app.use(function(req,res){
    res.status(404);
    res.send("File not found!")
})

app.listen(port,()=>{console.log(`Listening on http://localhost:${port}`)});