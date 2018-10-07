const ejs = require('ejs')
const bodyParser = require('body-parser')
const database = require('./database.js')
const express = require('express')
const bcrypt = require('bcrypt');
const session = require('express-session')

const app = express()

app.use(session({
  secret: 'lionel hutz',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use(express.static('views'))

app.use(bodyParser.urlencoded({
  extended: false
}))

app.set('view engine', 'ejs')

app.get('/', (request, response) => {
  if (request.session.username) {
    response.redirect('/home')
  }
  response.render('login', {
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
        request.session.username = username
        response.render('home', {
          username: username
        })
      })
    });
  });
});

app.get('/login', (request, response) => {
  if (request.session.username){
    response.redirect('/home')
  }
  response.render('login')
})

app.get('/home', (request, response) => {
  if (request.session.username){
    response.redirect('/home')
  }
  response.render('login')
})

app.get('/logout', (request, response) => {
  request.session.username = null
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
      request.session.username = user.username
      request.session.email = user.email
      const session = request.session
      console.log(session)
      return response.render('home', {
        username: user.username,
        email: user.email
      })
    }
    response.redirect('/login')
  })
});

app.get('/post', (request, response, next) => {
  response.render('post')
});

app.get('/post/:id', (request, response, next) => {
  response.render('comment', {
    commentId: request.params.id
  })
});

app.post('/post/:id', (request, response, next) => {
  const {
    comment
  } = request.body;

  const id = request.params.id

  database.postCommentData(id, comment, (err, data) => {
    if (err) throw err;
    response.redirect('/messages')
  })
});

app.post('/post', (request, response) => {
  const {
    title,
    message
  } = request.body;

  const username = request.session.username

  database.postMessageData(username, message, title, (err, data) => {
    if (err) throw err;
    response.redirect('/messages')
  })
});

app.get('/messages', (request, response) => {
  database.getAllMessageData((err, data) => {
    if (err) throw err;
    const messages = data.map(msg => msg)
    response.render('messages', {data: messages})
  })
})

app.listen(3000, () => {
  console.log('Listening on port 3000')
})