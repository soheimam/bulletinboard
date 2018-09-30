const ejs = require('ejs')
const bodyParser = require('body-parser')
const database = require('./database.js')
const express = require('express')
const bcrypt = require('bcrypt');

const app = express()

app.use(express.static('views'))

app.use(bodyParser.urlencoded({
  extended: false
}))

app.set('view engine', 'ejs')

app.get('/', (request, response) => {
  response.render('home', {
    username: null
  })
})

app.get('/register', (request, response) => {
  response.render('register')
})
app.post('/register', (request, response) => {

  const {
    username,
    email,
    password
  } = request.body;
  const saltRounds = 10;

  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(password, salt, (err, hash) => {
      database.postUserData(username, email, hash, (err, data) => {
        if (err) throw err;

        response.render('login', {
          username: username
        })
      })
    });
  });
});

app.get('/login', (request, response) => {
  response.render('login')
})

app.get('/logout', (request, response) => {
  response.redirect('/login')
})

app.post('/login', (request, response) => {
  const {
    email,
    password
  } = request.body;

  database.getUserData(password, email, (err, user) => {
    if (err) throw err;
    if (user.response === 200) {
      return response.render('home', {
        username: user.username,
        email: user.email
      })
    }
    response.render('error')
  })
});

app.post('/messages/:email', (request, response, next) => {
  const {
    message
  } = request.body;

  const emailAddress = request.params.email

  database.postMessageData(emailAddress, message, (err, data) => {
    if (err) throw err;
    response.redirect('/messages')
  })
});

app.get('/messages', (request, response) => {
  if (request.query.post) {
    return response.render('index', {
      email: request.query.email
    })
    
  }
  database.getAllMessageData((err, data) => {
    if (err) throw err;
    const messages = data.map(msg => msg)
    response.render('messages', {data: messages})
  })
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})