var http = require("http");
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./bastion.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the bastion database.');
  });
db.run(`
CREATE TABLE IF NOT EXISTS players(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, class INTEGER);
CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY, name TEXT, ilvl INTEGER DEFAULT 415);
CREATE TABLE IF NOT EXISTS upgrades (playerID INTEGER NOT NULL REFERENCES players, itemID INTEGER NOT NULL REFERENCES items, PRIMARY KEY (playerID, itemID));
`);
db.close();

http.createServer(function (request, response) {
   // Send the HTTP header 
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'});
   
   // Send the response body as "Hello World"
   response.end('Hello World\n');
}).listen(8080);

// Console will print the message
console.log('Server running at http://127.0.0.1:8080/');