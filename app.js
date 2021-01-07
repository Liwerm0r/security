require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect(process.env.DB_ACCESS_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
const User = mongoose.model('User', userSchema);

app.get("/", (req, res) => {
  res.render('home');
});

app.get("/login", (req, res) => {
  res.render('login');
});

app.get("/register", (req, res) => {
  res.render('register');
});

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds).then(function(hash) {
    const user = new User({
      email: req.body.username,
      password: hash
    });
    user.save((err) => {
      if ( !err ) {
        res.render('secrets');
      } else {
        console.log(err);
      }
    });
  });
});

app.post("/login", (req, res) => {
  User.findOne(
    { email: req.body.username },
    (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
          if (result) {
            res.render('secrets');
          } else {
            console.log("User name or password do not match.");
          }
        });
      }
    }
  );
});

app.listen(3000, () => {
  console.log("Application is running");
});
