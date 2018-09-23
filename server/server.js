const express = require('express');
const app = express();
const http = require('http').Server(app);
// const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const io = require('socket.io')(http); // Socket.io 


app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json()); // support json encoded bodies
// var corsOptions = {
//   origin: 'http://localhost:4200',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
// }

/// Linking to serve the angular route//////////////////////
// app.use(cors(corsOptions))
app.use(express.static(path.join(__dirname, '../chatapp/dist/chatapp')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../chatapp/dist/chatapp/index.html'))
});
app.get('/students', function (req, res) {
    res.sendFile(path.join(__dirname, '../chatapp/dist/chatapp/index.html'))
});
//////////////////////////////////////////////////////
const MongoClient = require('mongodb').MongoClient;
//connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'assignment2';
const assert = require('assert');

MongoClient.connect(url, {
    useNewUrlParser: true
}, function (err, client) {
    if (err) {
        return console.log(err);
    }
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    ///// Let's try to create a sample database
    // Find out if collection is empty
    // USER COLLECTION
    const usercollection = db.collection('users');
    usercollection.countDocuments(function (err, count) {
        if (err) {
            return console.log(err);
        }
        console.log(count);
        if (count === 0) {
            usercollection.insertMany([{
                    id: 1,
                    name: 'Long',
                    pass: '123',
                    type: 'super'
                },
                {
                    id: 2,
                    name: 'super',
                    pass: '123',
                    type: 'super'
                },
                {
                    id: 3,
                    name: 'Smith',
                    pass: '123',
                    type: 'normal'
                }
            ], function (err, result) {
                assert.equal(err, null);
                assert.equal(3, result.result.n);
                assert.equal(3, result.ops.length);
                console.log("Inserted 3 users");
                // callback(result);
            });
        }
    });

    // GROUP COLLECTION
    const groupcollection = db.collection('groups');
    groupcollection.countDocuments(function (err, count) {
        if (err) {
            return console.log(err);
        }
        console.log(count);
        if (count === 0) {
            groupcollection.insertMany([{
                    id: 1,
                    name: 'Griffith',
                    groupAdmin: 1,
                    users: [1, 2]
                },
                {
                    id: 2,
                    name: 'BCS',
                    groupAdmin: 2,
                    users: [2, 3]
                },
                {
                    id: 3,
                    name: 'BA',
                    groupAdmin: 1,
                    users: [1, 3]
                }
            ], function (err, result) {
                assert.equal(err, null);
                assert.equal(3, result.result.n);
                assert.equal(3, result.ops.length);
                console.log("Inserted 3 groups");
                // callback(result);
            });
        }
    });

    // CHANNEL COLLECTION
    const channelcollection = db.collection('channels');
    channelcollection.countDocuments(function (err, count) {
        if (err) {
            return console.log(err);
        }
        console.log(count);
        if (count === 0) {
            channelcollection.insertMany([{
                    name: 'c1',
                    groupid: 1,
                    users: [1, 2]
                },
                {
                    name: 'c2',
                    groupid: 1,
                    users: [1, 2]
                },
                {
                    name: 'c3',
                    groupid: 2,
                    users: [2, 3]
                },
                {
                    name: 'c4',
                    groupid: 2,
                    users: [2, 3]
                },
                {
                    name: 'c5',
                    groupid: 2,
                    users: [1, 3]
                }
            ], function (err, result) {
                assert.equal(err, null);
                assert.equal(5, result.result.n);
                assert.equal(5, result.ops.length);
                console.log("Inserted 5 channels");
                // callback(result);
            });
        }
    });

    const chatHistory = db.collection('chats');
    chatHistory.countDocuments(function (err, count) {
        if (err) {
            return console.log(err);
        }
        console.log(count);
        if (count === 0) {
            chatHistory.insertOne({
                channel: 'c1',
                username: 'Test',
                message: 'HELLO WORLD'
            }, function (err, result) {
                assert.equal(err, null);
                // assert.equal(5, result.result.n);
                // assert.equal(5, result.ops.length);
                console.log("Inserted 1 chat");
                // callback(result);
            });
        }
    });

    // Passing app and db connection into the required file
    require('./auth.js')(app, db);
    require('./user.js')(app, db);
    require('./group.js')(app, db);
    require('./channel.js')(app, db);
    require('./socket.js')(app, db, io);
    require('./listen.js')(http);

    /// Open server on port 3000
    // var port = 3000;
    // app.listen(port, function(){ //listen on port
    // console.log('Server running on port ' + port);
    // });


});