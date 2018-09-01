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
      {id:3, name: "Smith"},
      ],
  "groups":[
      {name: "Griffith", groupAdmin: "James", channels: [1,2,3]},
      {name: "UQ", groupAdmin: "Long", channels: [4,5,6]},
      {name: "Bond", groupAdmin: "Smith", channels: [7,8,9]},
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





