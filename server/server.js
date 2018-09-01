const express = require('express');
const app = express();
const http = require('http').Server(app);
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // support json encoded bodies
var corsOptions = {
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
app.use(cors(corsOptions))
app.use(express.static(path.join(__dirname, '../chatapp/dist/chatapp')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'../chatapp/dist/chatapp/index.html'))
});
app.get('/students', function(req,res){
    res.sendFile(path.join(__dirname,'../chatapp/dist/chatapp/index.html'))
});



let data = {
  "users":[
      {id:1, name: "Long", type: "admin"},
      {id:2, name: "James", type: "groupadmin"},
      {id:3, name: "Smith", type: "normal"},
      {id:4, name: "Ben", type: "normal"},
      {id:5, name: "Jason", type: "normal"},
      {id:6, name: "Thomas", type: "normal"},
      {id:6, name: "Alex", type: "normal"}
      ],
  "groups":[
      {name: "Griffith", groupAdmin: "James", users: [1]},
      {name: "UQ", groupAdmin: "Long", users: [2]},
      {name: "Bond", groupAdmin: "Ben", users: [3]},
      {name: "MIT", groupAdmin: "Smith", users: [4]},
      {name: "HARVARD", groupAdmin: "James", users: [5]}
      ],
  "roles":[
      {id: 1},
      {id: 2},
      {id: 3},
      ]
}

fs.writeFile('data.JSON', JSON.stringify(data), 'utf8',  (err) =>{
  if (err) throw err;
})
require('./user.js')(app,fs);
require('./group.js')(app,fs);
require('./login.js')(app,fs);

app.listen(3000, function(){ //listen on port 8000
  console.log('Server running');
});





