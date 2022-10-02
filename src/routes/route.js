const express= require('express');
const router = express.Router(); 
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");
const middleware = require('../middleware/auth')

let {createAuthor,loginAuthor} = authorController;
let {createBlog,getBlogs,updateBlog,deleteBlog,deleteByQuery} = blogController;
let {authenticate,authorize,authorizeByQuery} = middleware;

// ======> Create Author Api <=========
router.post('/authors', createAuthor);

// ======> Author Login Api <==========
router.post('/login', loginAuthor);

// ======> Create Blog Api <===========
router.post('/blogs', authenticate, createBlog);

// ======> Create Blog Api <===========
router.get('/blogs',authenticate, getBlogs);

// ======> Update Blogs Api <==========
router.put('/blogs/:blogId',authenticate, authorize, updateBlog);

// ======> Delete Blogs Api <==========
router.delete('/blogs/:blogId',authenticate, authorize, deleteBlog);

// ======> Delete Blogs By Query Params <=======
router.delete('/blogs',authenticate, authorizeByQuery, deleteByQuery);

//-----------------------API for wrong route-of-API--------------------------------->>>
router.all("/*", function (req, res) {
    return res.status(400).send({status: false,message: "Path Not Found"});
 });
 

module.exports= router;