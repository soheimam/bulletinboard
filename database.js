const { Client } = require('pg')
const sequelize = require('sequelize')
const { Message, User } = require('./migrations/migration')
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
    if (!user) {
      return callback(null, {
        response: 404
      })
    }
    bcrypt.compare(password, user.password, (err, res) => {
      if (err) {
        callback(err);
      }
      if (res == true) {
        return callback(null, {
          response: 200,
          username: user.username
        })
      }
      return callback(null, {
        response: 400
      })
    });
  })
}

function postCommentData(id, comment, callback) {
  Message.update({
      'comments': sequelize.fn('array_append', sequelize.col('comments'), comment)
    }, {
      'where': {
        'id': id
      }
    })
    .then(data => {
      callback(null, data)
    })
    .catch(err => {
      callback(err, null)
    })
}

function postMessageData(username, message, title, callback) {
  Message.insertOrUpdate({
      username: username,
      message: message,
      title: title
    })
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
      callback(err, null)
    })
}
module.exports = {
  postUserData,
  postMessageData,
  postCommentData,
  getUserData,
  getAllMessageData,
  getMessageData
}