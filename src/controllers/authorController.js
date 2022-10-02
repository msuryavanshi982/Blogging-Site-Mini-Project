const authorModel = require('../models/authorModel');
const jwt = require('jsonwebtoken');
const validations = require('../validator/validations');

const {isEmpty, isValidName, isValidEmail, isValidPassword}=validations;

// =============> Create Author's Data <==============
const createAuthor = async(req, res)=>{
    try {
        let data = req.body;
        if(Object.keys(data).length == 0) {
            return res.status(400).send({status: false, msg:"Data is required"})
        };
        
        let {fname,lname,title,email,password}=data;  
        //checking if mandatory keys are not present or not 
        if(!isEmpty(fname)){
            return res.status(400).send({status: false, msg:"fname must be present"});
        };
        if(!isEmpty(lname)){
            return res.status(400).send({status: false, msg:"lname must be present"});
        };
        if(!isEmpty(title)){
            return res.status(400).send({status: false, msg:"title must be present"});
        };
        if(!isEmpty(email)){
            return res.status(400).send({status: false, msg:"email must be present"});
        };
        if(!isEmpty(password)){
            return res.status(400).send({status: false, msg:"password must be present"});
        };

        //checking validations of every values
        if(!isValidName(fname)) { 
            return res.status(400).send({status: false, msg:"fName should include Alphabates Only."});
        };
        if(!isValidName(lname)) {
            return res.status(400).send({status: false, msg:"lName should include Alphabates only."});
        };
        if(!isValidEmail(email)) {
            return res.status(400).send({status: false, msg:"provide a valid emailId"});
        };
        if(!isValidPassword(password)) {
            return res.status(400).send({status: false, msg:"Password must contain atleast 8 characters including one upperCase, lowerCase, special characters and Numbers"});
        };
        if(!["Mr", "Miss", "Mrs"].includes(title)) {
            return res.status(400).send({status: false, msg:"Title should only include 'Mr','Miss','Mrs'"});
        };

        email=email.toLowerCase(); //if user send Email in uppercase so by using toLowerCase it convert auto lower case
        let checkEmail = await authorModel.findOne({email: email})
        if (checkEmail) {
            return res.status(400).send({status: false, msg: `this email ${email} is already exist`});
        };

        let createData = await authorModel.create(data);
        return res.status(201).send({status: true,msg:"Author has been created successfully", data:createData});
    } catch(err){
        res.status(500).send({status: false, msg: err.message});
    };
};

// ============> Author Login Api <====================  
const loginAuthor = async(req, res)=> {
    try {
        const data = req.body;
        if(Object.keys(data).length == 0) {
            return res.status(400).send({status:false, msg:"Email and Password is required"});
        };

        let {email,password}=data;
        if(!isEmpty(email)){
            return res.status(400).send({status:false, message:"EmailId is mandatory"});
        };
        if(!isEmpty(password)){
            return res.status(400).send({ status: false, message: "Password is mandatory"})
        };
        let checkCredentials = await authorModel.findOne({ email: email, password: password });
        if (!checkCredentials){
            return res.status(401).send({status: false, message: "Provide a valid credentials." })
        };
        let token = jwt.sign({
            authorId: checkCredentials._id.toString(),
            project: 1,
            group: "group-2",
        },"functionUp-project1");
        return res.status(200).send({status: true,msg:"Token has been generated",token: {token}});
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    };
};

module.exports.createAuthor = createAuthor;
module.exports.loginAuthor = loginAuthor;