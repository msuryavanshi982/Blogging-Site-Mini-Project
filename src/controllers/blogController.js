const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const validations = require('../validator/validations');

const {isEmpty, isValidName, isValidObjectId}=validations;

// =================> CREATE BLOGS <====================
const createBlog = async(req, res)=> {
  try {
    let data = req.body;
    if (Object.keys(data).length == 0){
      return res.status(400).send({status:false, msg:"Data is required"});
    };    

    const {title, body, authorId, category, subcategory, tags} = data;
    if (!isEmpty(title)){
      return res.status(400).send({status:false, msg:"Title must be present"});
    };
    if (!isEmpty(body)){
      return res.status(400).send({status:false, msg:"Body must be present"});
    };
    if (!isEmpty(category)){
      return res.status(400).send({status:false, msg:"Category must be present" });
    };
    if (!isEmpty(authorId)){
      return res.status(400).send({status:false, msg:"authorId must be presnt"});
    };
    if (!isValidObjectId(authorId)) {
      return res.status(400).send({status:false, msg:"Invalid authorId"});
    };
    if(!isValidName(title)){
        return res.status(400).send({status:false,msg:"title should include alphabets only"});
    };
    if(!isValidName(category)){
        return res.status(400).send({status:false,msg:"category should include alphabets only"});
    };
    if(tags || tags==""){
      if (!isEmpty(tags)){
        return res.status(400).send({status:false, msg:"tags must be presnt"});
      };
    };
    if(subcategory || subcategory==""){
      if (!isEmpty(subcategory)){
        return res.status(400).send({status:false, msg:"subcategory must be presnt"});
      };
    };
    let getAuthorData = await authorModel.findById(authorId);
    if (!getAuthorData){
      return res.status(404).send({status: false,msg:`No author present by this ${authorId}`});
    };
    if (data["isPublished"] == true) {
        data["publishedAt"] = Date.now();
    };
    let createBlogs = await blogModel.create(data);
        res.status(201).send({status:true,msg:"Blogs created successfully",data: createBlogs});    
  } catch (err) {
    res.status(500).send({status:false, msg:err.message});
  };
};

// ===================> Get Blog Details <=====================
const getBlogs = async (req, res) => {
  try {
    let data=req.query;  
    if (Object.keys(data).length==0){ 
      return res.status(400).send({status:false,msg:"Provide atleast one Query to fetch blog details"});
    };
  
    let {category, authorId, tags, subcategory}=data;
    let filter={isDeleted:false, isPublished:true};
  
    if(category || category==""){
      if (!isEmpty(category)) {
        return res.status(400).send({status:false,msg:"category must be present"});
      };
      filter.category=category;
    };
    if(authorId || authorId==""){
      if(!isEmpty(authorId)){
        return res.status(400).send({status:false,msg:"authorId must be present"});
      };
      if (!isValidObjectId(authorId)){
        return res.status(400).send({status:false,msg:"Invalid blogId"});
      };
      filter.authorId=authorId;
    };
    if(tags){
      if(tags.trim().length==0){
        return res.status(400).send({status:false,msg:"Enter valid tags"});
      };
      tags=tags.split(",")
      filter.tags={$in:tags}
    };
    if(subcategory) {
      if(subcategory.trim().length==0){
        return res.status(400).send({status:false,msg:"Enter valid subcategory"});
      };
      subcategory=subcategory.split(",")
      filter.subcategory={$in:subcategory}
    };
    let fetchBlogs=await blogModel.find(filter);
    if(fetchBlogs.length==0){
      return res.status(404).send({status:false,msg:"Such Blogs Not Available" })
    }  
      return res.status(200).send({status:true,data:fetchBlogs});
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};

// ===================> Update Blogs Api <=====================
const updateBlog = async(req, res)=> {
    try {
      let blogId = req.params.blogId;
      let data = req.body;
      if (!isValidObjectId(blogId)) {
        return res.status(400).send({status: false, msg: "Invalid blogId"});
      };

      let {title, body, tags, subcategory} = data;
  
      if (Object.keys(data).length==0){
        return res.status(400).send({status:false, msg: "body Must be filled"});
      };
      if(title || title==""){  
        if (!isEmpty(title)){
            return res.status(400).send({status:false, msg:"title must be presnt"});
        };
        if(!isValidName(title)){
            return res.status(400).send({status:false,msg:"title should include alphabets only"});
        };
      };
      if(body || body==""){  
        if (!isEmpty(body)){
            return res.status(400).send({status:false, msg:"body must be presnt"});
        };
      };
      if(tags || tags==""){  
        if (!isEmpty(tags)){
            return res.status(400).send({status:false, msg:"tags must be presnt"});
        };
        if(!isValidName(tags)){
            return res.status(400).send({status:false,msg:"tags should include alphabets only"});
        };
      };
      if(subcategory || subcategory==""){  
        if (!isEmpty(subcategory)){
            return res.status(400).send({status:false, msg:"subcategory must be presnt"});
        };
        if(!isValidName(subcategory)){
            return res.status(400).send({status:false,msg:"subcategory should include alphabets only"});
        };
      };
    let updateQuery = {title:title, body: body};
    let addQuery = {tags:tags, subcategory:subcategory};

      const filterBlogs = await blogModel.findOne({$and: [{isDeleted: false}, {isPublished: true}]});
      if (!filterBlogs){
        return res.status(404).send({status: false,msg:"No filter possible are available"});
      };  
  
      // WE ARE FINDING ONE BY BLOG ID AND UPDATING //
      let updatedblog = await blogModel.findOneAndUpdate({_id:blogId},{$set:updateQuery, $push:addQuery,publishedAt:Date.now()},{new:true});

        res.status(200).send({status:true,msg:"Blog is Updated Successfully",data: updatedblog});
    } 
    catch (err) {
      res.status(500).send({status:false, msg:err.message });
    };
};

// ============> Delete Blogs By blogId <==============
const deleteBlog = async(req,res)=> {
  try{
    let blogId = req.params.blogId;
    if(!isValidObjectId(blogId)) {
      return res.status(400).send({status:false,msg:"Invalid blogId"});
    };
    let checkBlog = await blogModel.findById(blogId);
    if(!checkBlog){
      return res.status(404).send({status:false,message:"no such blog exists"});
    };  
    if(checkBlog.isDeleted){
      return res.status(404).send({status:false,msg:"Blog is already deleted"});
    };  
    let deleteData = await blogModel.findOneAndUpdate({_id:blogId},{$set:{isDeleted:true,deletedAt:Date.now()}},{new:true});
    res.status(200).send({status:true,msg:"Blog deleted successfully",data:deleteData});
  } 
  catch(err) {
    res.status(500).send({status:false,msg:err.message});
  }
};

// ============>Delete Blogs By Query Params <==============
const deleteByQuery = async(req, res)=> {
  try {
    let data=req.query  
    if (Object.keys(data).length==0){ 
      return res.status(400).send({status:false,msg:"Provide atleast one Query to delete blog"});
    };
  
    let {category, authorId, tags, subcategory, isPublished}=data;
    let filter={isDeleted:false};
  
    if(category || category==""){
      if (!isEmpty(category)) {
        return res.status(400).send({status:false,msg:"category must be present"});
      };
      filter.category=category;
    };
    if(authorId || authorId==""){
      if(!isEmpty(authorId)){
        return res.status(400).send({status:false,msg:"authorId must be present"});
      };
      if (!isValidObjectId(authorId)){
        return res.status(400).send({status:false,msg:"Invalid blogId"});
      };
      filter.authorId=authorId;
    };
    if(tags){
      if(tags.trim().length==0){
        return res.status(400).send({status:false,msg:"Enter valid tags"});
      };
      tags=tags.split(",")
      filter.tags={$in:tags}
    };
    if(subcategory) {
      if(subcategory.trim().length==0){
        return res.status(400).send({status:false,msg:"Enter valid subcategory"});
      };
      subcategory=subcategory.split(",")
      filter.subcategory={$in:subcategory}
    };
    if(data.hasOwnProperty("isPublished")){
      if (!["true","false"].includes(isPublished)){
        return res.status(400).send({status:false,msg:"is published can only be a boolean value"});
      };
      filter.isPublished=isPublished;
    };
  
    const deleteBlogs=await blogModel.updateMany(filter,{$set:{isDeleted:true, deletedAt:Date.now()}});
    // console.log(data)
    if (deleteBlogs.modifiedCount==0){
      return res.status(404).send({status:false,msg:"Such Blog Data not found"});
    }
      return res.status(200).send({status:true,msg:"Blog Deleted Successfully"});
  }
  catch(err){
    res.status(500).send({status:false,msg:err.message});
  };
};
  

module.exports.createBlog= createBlog;
module.exports.getBlogs= getBlogs;
module.exports.updateBlog= updateBlog;
module.exports.deleteBlog= deleteBlog;
module.exports.deleteByQuery= deleteByQuery;