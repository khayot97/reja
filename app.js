console.log("Web Serverni boshlash");
const { log } = require("console");
const express = require("express");
const app = express();

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
const db = require("./server").db();
const mongodb = require("mongodb");
// 1: Kirish codelar

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2: Session codelar

// 3: View codelar
app.set("views", "views");
app.set("view engine", "ejs");


// 4: Routing code
app.post("/create-item", (req, res) => {
    // console.log(req.body);
    console.log('user entered /create-item');
    const new_reja = req.body.reja;
    db.collection("plans").insertOne({ reja: new_reja }, (err, data) => {
        if(err) {
            console.log(err);
            res.end("something went wrong");
        } else {
            res.end("successfully added");
        }
    }); 
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
