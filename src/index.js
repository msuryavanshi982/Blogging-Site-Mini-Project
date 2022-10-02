const express = require("express");
// const bodyParser = require("body-parser");
const route = require("./routes/route");
const { default: mongoose } = require("mongoose");
const app = express();

app.use(express.json());

let url ="mongodb+srv://projectBlogGroup4:vtbjJPPyqvrHsBXQ@cluster0.rrdjyhd.mongodb.net/project-1";
let port = process.env.PORT || 3000;

mongoose.connect(url, {useNewUrlParser: true })
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(port, function() {
  console.log("Express app running on port " + port);
});


