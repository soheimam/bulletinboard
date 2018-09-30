const { Client } = require('pg')
const { Message, User } = require('./migrations/init')
const bcrypt = require('bcrypt')

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: 'localhost',
  database: 'blog_app',
  password: process.env.POSTGRES_PASSWORD
})

client.connect()
//connecting to postgres

function getUserData(password, email, callback) {
  User.findOne({
    where: {
      email: email
    }
  }).then(user => {
    if (!user.email) {
      return callback(null, {
        response: 404
      })
    }
    bcrypt.compare(password, user.password, (err, res) => {
      if(err) {
        callback(err);
      }
      if (res == true) {
        return callback(null, {
          response: 200,
          username: user.username,
          email: user.email
        })
      }
      return callback(null, {
        response: 400
      })
    });
  })
}

function postMessageData(email, message, callback) {
  Message.insertOrUpdate({email: email, message: message})
    .then(data => {
      callback(null, data)
    })
    .catch(err => {
      callback(err, null)
    })
}

function getMessageData(username, callback) {
  Message.findAll({
    where: {
      username: username
    }
  })
  .then(data => {
    callback(null, data)
  })
  .catch(err => {
    callback(err)
  })
}

function getAllMessageData(callback) {
  Message.findAll({})
  .then(data => {
    console.log(data)
    callback(null, data)
  })
  .catch(err => {
    callback(err)
  })
}

function postUserData(username, email, password, callback) {
  User.create({
      username: username,
      email: email,
      password: password
    })
    .then(data => {
      callback(null, data)
    })
    .catch(err => {
      callback(error, null)
    })
}
module.exports = {
  postUserData,
  postMessageData,
  getUserData,
  getAllMessageData,
  getMessageData
}