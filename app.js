//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require('lodash');

//connect DB to mongodb Atlas
mongoose.connect('mongodb+srv://admin:tabassum99@todocluster.zmi4cxq.mongodb.net/dairyDB');

//DB Schema
const dairySchema = {
  title: String,
  desc: String
};

//DB model
const Dairy = mongoose.model("Dairy", dairySchema);

const title = [];
const descp = [];

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get("/", function(req, res) {
  Dairy.find({}, function(err, dairy){
    if(!err){
      if(!dairy) console.log("Collection is empty! Add dairy to database")
      else{
        res.render("home", {
          homeContainer: homeStartingContent, arr: dairy
        });
      }
    }
  });
});

// app.get("/about", function(req, res) {
//   res.render("about", {
//     aboutContent: aboutContent
//   });
// });

// app.get("/contact", function(req, res) {
//   res.render("contact", {
//     contactContent: contactContent
//   })
// });

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.get("/posts/:id", function(req, res){
  let id = req.params.id;
  Dairy.findOne({_id:id}, function(err, dairy){
    if(!err){
      if(dairy){
        res.render("post", {
          titleArr: dairy
        });
      }
    }
  });
});

app.post("/", function(req, res) {
  console.log(req.body);
  let titleItem = req.body.blogTitle;
  let descpItem = req.body.textArea;
  Dairy.create({
    title:titleItem,
    desc: descpItem
  });
  res.redirect("/");
});

app.post("/delete", function(req, res) {
  console.log(req.body);
  const delTitle = req.body.button;
  Dairy.findOneAndDelete({title:delTitle}, function(err){
    if(!err) console.log("Deleted "+delTitle+" from the database.")
    res.redirect("/");
  });
});

app.get("/edit/:id", function(req, res) {
  let id = req.params.id;
  Dairy.findOne({_id:id}, function(err, dairy){
    if(!err){
      if(dairy){
        res.render("edit", {
          arr: dairy
        });
      }
    }
  });
});

app.post("/edit", function(req, res) {
  console.log(req.body);
  const id = req.body.hidden_id;
  const editTitle = req.body.editTitle;
  const editDesc = req.body.textArea;
  Dairy.findOneAndUpdate({_id:id},{ $set: { title: editTitle, desc:editDesc}}, function(err){
    if(!err)
      console.log("Edit successful");
      res.redirect("/");
    });
    // res.redirect("/edit");
  });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
