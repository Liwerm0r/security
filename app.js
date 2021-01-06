require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect(process.env.DB_ACCESS_URL, {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password'] });

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
  const user = new User({
    email: req.body.username,
    password: req.body.password
  });
  user.save((err) => {
    if ( !err ) {
      res.render('secrets');
    } else {
      console.log(err);
    }
  });
});

app.post("/login", (req, res) => {
  User.findOne(
    { email: req.body.username },
    (err, foundUser) => {
      if ( !err ) {
        if ( foundUser.password === req.body.password ) {
          res.render('secrets');
        } else {
          console.log("user not found.");
        }
      } else {
        console.log(err);
      }
    }
  );
});







app.listen(3000, () => {
  console.log("Application is running");
});
