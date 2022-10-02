const blogModel = require('../models/blogModel');
const jwt = require('jsonwebtoken');

// =============> Authentication <================================
const authenticate = async function (req, res, next) {
  try {  
    let token=req.headers["x-api-key"] || req.headers["X-Api-Key"];
    if(!token) return res.status(400).send({status:false,msg:"Token must be present"})
    let decodedToken=jwt.verify(token,"functionUp-project1");
    if(!decodedToken) return res.status(400).send({status:false,msg:"Provide a valid token"});
    req.token=decodedToken;
    next();
  }
  catch (err) {
    res.status(500).send({status:false,msg:err.message});
  }
};

// =============> Authorization <================================
const authorize = async function (req, res, next) {
  try {
    let authorLoggedIn = req.token.authorId;
    let blogId = req.params.blogId;
    let checkBlogId = await blogModel.findById(blogId)
    if (!checkBlogId) {
      return res.status(404).send({status: false, message: "Blog not Found"})
    }
    if (checkBlogId.authorId != authorLoggedIn) {
      return res.status(403).send({status: false,msg:"loggedin author not allowed to modify changes"});
    }
      next();
    } catch (err) {
      return res.status(500).send({status:false,msg:err.messge });
    }
  };

// =============> authorizeByQuery <================================
const authorizeByQuery = async function (req, res, next) {
  try{
    let authorLoggedIn = req.token.authorId    //Accessing authorId from attribute
  
    let conditions=req.query;                  //Checks if condition for deletion is coming or not
    if(Object.keys(conditions).length==0){
        return res.status(400).send({status: false,msg:"Provide information for deletion"});
    };
    if(conditions.authorId){
      if (!conditions.authorId.match(/^[0-9a-f]{24}$/)){
        return res.status(400).send({status:false,msg:"Not a valid ObjectId"});
      };
      if (conditions.authorId!=authorLoggedIn){
        return res.status(403).send({status:false,msg:'Author not authorised'});
      }
    };
    let authorAccessing=await blogModel.find({$and:[conditions,{isDeleted:false}]});
       
    if (authorAccessing.length==0){
        return res.status(404).send({status:false,msg:"No Blogs Found"});
    };
  
    let accessedBlog=authorAccessing.filter(blogs=>blogs.authorId==authorLoggedIn);
        
    if(accessedBlog.length==0){
        return res.status(403).send({status: false,msg: "User Not Authorised"});
    };
    req.id=authorLoggedIn //attribute to store the author id from token
    next();
  }
  catch(err) {
    res.status(500).send({status:false,msg: err.message});
  };
};

module.exports={authenticate,authorize,authorizeByQuery};