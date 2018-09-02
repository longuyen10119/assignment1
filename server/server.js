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



// let data = {
//   "users":[
//       {id:1, name: "Long", type: "super"},
//       {id:2, name: "Nguyen", type: "groupadmin"},
//       {id:3, name: "Smith", type: "normal"},
//       {id:4, name: "Ben", type: "normal"},
//       {id:5, name: "Jason", type: "normal"},
//       {id:6, name: "Thomas", type: "normal"},
//       {id:7, name: "Alex", type: "normal"}
//       ],
//   "groups":[
//       {name: "Griffith", groupAdmin: "Nguyen", users: [2,1]},
//       {name: "UQ", groupAdmin: "Long", users: [2]},
//       {name: "Bond", groupAdmin: "Ben", users: [3]},
//       {name: "MIT", groupAdmin: "Smith", users: [4]},
//       {name: "HARVARD", groupAdmin: "James", users: [5]}
//       ],
//   "roles":[
//       {id: 1},
//       {id: 2},
//       {id: 3},
//       ]
// }
let dataNew = {
    "users":[
        {id:1, name: "Long", type: "super"},
        {id:2, name: "Nguyen", type: "groupadmin"},
        {id:3, name: "Smith", type: "normal"},
        {id:4, name: "Ben", type: "groupadmin"},
        {id:5, name: "Jason", type: "normal"},
        {id:6, name: "Thomas", type: "normal"},
        {id:7, name: "Alex", type: "normal"}
        ],
    "groups":[
        {id:1, name: "Griffith", groupAdmin: 2, users: [2,1]},
        {id:2, name: "UQ", groupAdmin: 4, users: [4,2]},
        {id:3, name: "Bond", groupAdmin: 3, users: [3]},
        {id:4, name: "MIT", groupAdmin: 4, users: [4]},
        {id:5, name: "HARVARD", groupAdmin: 5, users: [5]}
        ],
    "user_group":[
        {user: 1, group: 1},
        {id: 2},
        {id: 3},
        ]
  }

fs.writeFile('data.JSON', JSON.stringify(dataNew), 'utf8',  (err) =>{
  if (err) throw err;
})
require('./user.js')(app,fs);
require('./group.js')(app,fs);
require('./login.js')(app,fs);

app.listen(3000, function(){ //listen on port 8000
  console.log('Server running');
});





