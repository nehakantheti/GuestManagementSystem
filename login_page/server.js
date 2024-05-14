const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

app.set('view engine','ejs');

//load static assets
app.use('/static',express.static(path.join(__dirname,'public')))
app.use('/static',express.static(path.join(__dirname,'public/assets')))

//home route
app.get('/',(req,res)=>{
    res.render('base',{title: "Login System"});
})

app.listen(port,()=>{console.log("Listening to the server on http://localhost:3000")})
