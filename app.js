console.log("Web Serverni boshlash");
const { log } = require("console");
const express = require("express");
const app = express();
 // app obejct  bilan backend sereverini qurolamiz uning proportiylari orqali! 
 // state & mathed 
 // bular use & set & post methodlar 

const fs = require("fs");

let user;
fs.readFile("database/user.json", "utf8", (err, data) => {
  if (err) {
    console.log("ERROR:", err);
  } else {
    user = JSON.parse(data);
  }
});

// MongoDB chaqirish
// db & app obejct bular bilan crud operlarni qilolasiz database bilan!
const db = require("./server").db(); 
const mongodb = require("mongodb");

// 1: Kirish code
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2: Session code

// 3: View code
app.set("views", "views");
app.set("view engine", "ejs");

// 4: Routing code
// axios kelyapti frontendan
// STEP - 2 frontendan bcakendga kirib kealdi
// bu post orqali malumot jonatganmiz req orqali bodydan olamiz
app.post("/create-item", (req, res) => {
    console.log('user entered /create-item');
    const new_reja = req.body.reja;
    // malumotlar bu yerga kelgan
// STEP-3 backendan chiqb database boramiz create yaratimiz 
    db.collection("plans").insertOne({ reja: new_reja }, (err, data) => {
       res.json(data.ops[0]);
// STEP-4 db qaytibkeldik backendga qoshilgan malumoni olib 
// STEP-5 backendan frontendga malumot yuboradi
    }); 
});

app.post("/delete-item", (req, res) => {
  const id = req.body.id;
  db.collection("plans").deleteOne({_id: new mongodb.ObjectId(id)},
   function(err, data) {
    res.json({state: "success"});
   }
  );
});

app.post("/edit-item", (req, res) => {
  const data = req.body;
  console.log(data);
  db.collection("plans").findOneAndUpdate(
    {_id: new mongodb.ObjectId(data.id)},
    {$set: {reja: data.new_input}},
    function(err, data) {
      res.json({state: "success" });
    }
   );
});

app.post("/delete-item", (req, res) => {
  const id = req.body.id;
  db.collection("plans").deleteOne(
    { _id: new mongodb.ObjectId(id) },
    function (err, data) {
      res.json({ state: "succes" });
    }
  );
});

app.post("/edit-item", (req, res) => {
  const data = req.body;
  console.log(data);
  db.collection("plans").findOneAndUpdate(
    { _id: new mongodb.ObjectId(data.id) },
    { $set: { reja: data.new_input } },
    function (err, data) {
      res.json({ state: "succes" });
    }
  );
});

app.post("/delete-all", (req, res) => {
  if (req.body.delete_all) {
    db.collection("plans").deleteMany(function () {
      res.json({ state: "Hamma rejalar ochirildi" });
    });
  }
});

app.get("/author", (req, res) => {
  res.render("author", { user: user });
});

app.post("/delete-all" , (req, res) => {
  if(req.body.delete_all) {
    db.collection("plans")
    .deleteMany(function() {
      res.json({ state: "hamma rejalar o'chirildi" });
    });
  }
});



app.get("/", function (req, res) {
  console.log("user entered /");
  db.collection("plans")
    .find()
    .toArray((err, data) => {
      if (err) {
        console.log(err);
        res.end("something went wrong");
      } else {
        res.render("reja", { items: data });
      }
    });
});

module.exports = app;
