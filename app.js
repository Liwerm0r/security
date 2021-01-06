const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const credentials = require('./credentials');

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect(credentials.dbUrl, {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
// Encryption
var secret = "fwefegdfgsdgdfhrjrhdbsdhfghfs";
userSchema.plugin(encrypt, { secret: secret , encryptedFields: ['password'] });

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
