const express = require("express");
const morgan = require("morgan");
const {v4:uuidv4} = require("uuid");

const app = express()
const port = 3000;

morgan.token('id',function getId(req){
    return req.id
})

app.use(assignid);

app.use(morgan(':id :method :status :url "HTTP/:http-version"'));

app.use('/',(req,res)=>{
    res.end("Morgan Logger App");
})

function assignid(req,res,next){
    req.id = uuidv4();
    next();
}

app.listen(port,()=>{console.log(`Server is running on http://localhost:${port}`)});
