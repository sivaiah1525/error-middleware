"use strict";
const express = require("express");
const path = require("path");
const port = 2000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("mongoose-bcrypt");
const app = express();
app.set("view engine", "ejs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      uniqueValidator: true,
      lowercase: true
    },
    dob: { type: String, required: true, trim: true },
    age: { type: Number, required: true, trim: true },
    gender: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true, bcrypt: true },
    countrycode: { type: Number, required: true, trim: true },
    contactnumber: { type: Number, required: true, trim: true },
    skills: { type: Array, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    location: { type: Array, required: true, trim: true }
  },
  { timestamps: true }
);
userSchema.plugin(bcrypt);

const User = mongoose.model("user", userSchema);

mongoose
  .connect("mongodb://localhost:27017/users", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  })
  .then(() => console.log("Connected successfully"))
  .catch(() => {
    console.error("Db connection failed");
    process.exit(-1);
  });
app.get("/", (req, res) => {
  res.render("index");
});
// create data
app.post("/addUser", (req, res) => {
  async function addUser() {
    const data = req.body;
    // console.log(data);
    const doc = new User(data);
    try {
      const result = await doc.save();
      // console.log(result);
    } catch (error) {
      console.error(error);
    }
    res.redirect("/userList");
  }
  addUser();
});
//view data
app.get("/userList", async (req, res) => {
  async function listUsers() {
    try {
      const result = await User.find({});
      //   console.log(result);
      res.render("welcome", { usersData: result });
    } catch (error) {
      console.error(error);
    }
  }
  listUsers();
});

//edit data
app.post("/edit", async (req, res) => {
  console.log(req.body.id);
  const id = req.body.id;
  async function editUser() {
    try {
      const result = await User.findById(id);
      //   console.log(result);
      res.render("Edit", { usersData: result });
    } catch (error) {
      console.error(error);
    }
  }
  editUser();
});
//update data in db
app.post("/editdata", (req, res) => {
  const id = req.body.id;
  async function EditUser() {
    try {
      const result = await User.findByIdAndUpdate(id, req.body, { new: true });
      //   console.log(result);
      res.redirect("/userList");
    } catch (error) {
      console.error(error);
    }
  }
  EditUser();
  res.redirect("/userList");
});
//delete data
app.post("/delete", async (req, res) => {
  console.log(req.body.id);
  const id = req.body.id;
  async function deleteUsers() {
    try {
      const result = await User.findByIdAndDelete(id);
      //   console.log(result);
      res.redirect("/userList");
    } catch (error) {
      console.error(error);
    }
  }
  deleteUsers();
});
app.listen(port, () => {
  console.log("Server listening on port " + port);
});
