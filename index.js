
const ejs = require('ejs')
const bodyParser = require('body-parser')
const database = require('./database.js')
const express = require('express')
const app = express()

app.use(express.static('views'))

app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index')
})

app.post('/messages', (request,response)=>{
    const {title,body} = request.body;
    database.postData(title,body,(data)=>{
      console.log(data)
      response.redirect('/messages')
    })
});

app.get('/messages', (request,response)=>{
  database.getData((data)=>{
    response.render('messages',{data: data})
  })
})
 
app.listen(3000)
