const path = require('path');
const express = require("express");
const mongoose = require('mongoose');
const cookieparser = require("cookie-parser");
const Blog = require("./models/blog")

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');

const app = express();
const PORT = 8000;

app.use(express.urlencoded({extended : true}));
app.use(cookieparser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve('./public')));  

mongoose
.connect('mongodb://127.0.0.1:27017/blogify')
.then((e)=>console.log("mongodb connected"));


app.set('view engine' , 'ejs')
app.set('views' , path.resolve("./views"))   // iske liye path require krte h 


app.get('/', async(req,res) => {
    const allblogs = await Blog.find({}).sort("createdAt");
    res.render('home',{
        user : req.user,
        blogs: allblogs,
    })
})


app.use("/user",userRoute);
app.use("/blog",blogRoute);

app.listen(PORT , () => console.log("server started at port : " + PORT)); 