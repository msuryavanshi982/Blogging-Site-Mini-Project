const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/route");
const { default: mongoose } = require("mongoose");
const app = express();

app.use(bodyParser.json());

// let url ="mongodb+srv://projectBlogGroup4:vtbjJPPyqvrHsBXQ@cluster0.rrdjyhd.mongodb.net/project-1";
let url =
  "mongodb+srv://ishaan:ishaan007@cluster1.wumfpap.mongodb.net/?retryWrites=true&w=majority";
let port = process.env.PORT || 3000;

mongoose.connect(url, {useNewUrlParser: true })
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(port, function() {
  console.log("Express app running on port " + port);
});


/* Group-4 :

Ishaan: 6378088268
Atul:  
Subhajit Banerjee:
Meenakshi Lodhi : 9761366474

*/