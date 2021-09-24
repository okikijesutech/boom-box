const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// install this
// const dotenv = require('dotenv')
// const crytpojs = require('crytojs')

const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/boomboxDB');

const userSchema = new mongoose.Schema ({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email : {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

const userId = mongoose.model('userId', userSchema);

app.get('/', (req, res) => {
  res.render('home')
});

app.get('/featured', (req, res) => {
  res.render('featured')
});

app.get('/signup', (req, res) => {
  res.render('signup')
});

app.post('/signup', async (req, res) => {
  const newUser = new userId ({
    username: req.body.userName,
    email: req.body.email,
    password: req.body.password
  });

// to encrtyuse : CryptoJS.encrypt(req.body.pasword, process.env.PASS_CODE).toString()

  try {
    const savedUser = await newUser.save()
    res.redirect('/')
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get('/login', (req, res) => {
  res.render('login')
});

app.post('/login', async (req, res) => {
  try {
    const userId = await userId.findOne({
      userName: req.body.userName,
      password: req.body.password
    })

    res.status(200).json()
  } catch {
    res.status(500).json()
  }

})


app.listen(3000, ()=> {
  console.log('Server up and running');
})
