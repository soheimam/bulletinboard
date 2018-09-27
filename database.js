const { Client } = require('pg')

const client = new Client({
    user: process.env.POSTGRES_USER,
    host: 'localhost',
    database: 'bulletinboard',
    password: process.env.POSTGRES_PASSWORD
  })

client.connect()
//connecting to postgres

// running a query using SQL language 
function getData(callback){
    const query = {
        name: 'fetch-user',
        text: 'SELECT * FROM messages'
      }
    client.query(query, (err, res) => {
        callback(res.rows)
      })
}


function postData(title,body,callback){
    const values = [title,body]
    client.query('INSERT INTO messages(title,body) VALUES($1, $2) RETURNING *', values, (err, res) => {
        // client.end()
        callback(res.rows)
      })
}
 module.exports = {postData, getData}