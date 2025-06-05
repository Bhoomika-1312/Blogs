const { Router } = require("express");
const router = Router();
const multer = require('multer');
const Blog = require('../models/blog')
const path = require('path');
const Comment = require('../models/comment')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`))
  },
  filename: function (req, file, cb) {
     const fileName = `${Date.now()}-${file.originalname}`;
     cb(null,fileName);
  }
})

const upload = multer({ storage: storage })

router.get('/add-new' , (req,res) => {
    return res.render('addBlog' , {
        user : req.user
    })
})

router.post('/' , upload.single('CoverImage') , async (req,res)=>{  
    const { title , body } = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`);
})

router.post("/comment/:blogId", async(req,res) => {
  console.log("Reached comment route");
  console.log("req.body:", req.body);
  console.log("req.user" , req.user);
  console.log("id : " , req.params)
  await Comment.create({
    content : req.body.content,
    blogId : req.params.blogId,
    createdBy : req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

router.get('/:id', async (req,res) => {
  console.log("this is first ") ;
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  return res.render("blog", {
    user : req.user,
    blog,
  });
});

module.exports = router;