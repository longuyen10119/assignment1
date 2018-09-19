module.exports = (app, db) => {
    const assert = require('assert');
    
    // Get Users via get
    app.get('/api/users', (req, res) => {
        const collection = db.collection('users');
        collection.find({}, {projection:{'_id':0,pass:0}}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Found the following users");
            console.log(docs);
            res.send(docs)
        });
    });

    // Add User via post
    app.post('/api/user/', (req, res) => {
        const collection = db.collection('users');
        console.log(req.body.name);
        let name = req.body.name;
        console.log(name);
        // How to add???
        // Find a way to get to the lastest added item 
        // findOne({}, {sort:{$natural:-1}})
        collection.findOne({},{sort:{$natural:-1},projection:{_id:0,pass:0,type:0}} ,function(err, result) { // find the last item
            assert.equal(err, null);
            console.log("Found the last one");
            let newid = result.id +1;
            let querry = {id:newid, name:name, pass:'123', type:'normal'};
            collection.insertOne(querry, (err,result)=>{
                assert.equal(err,null);
                console.log("ADd succesful");
                collection.find({}, {projection:{'_id':0,pass:0}}).toArray(function(err, docs) {
                    assert.equal(err, null);
                    console.log("Found the following users");
                    console.log(docs);
                    res.send(docs)
                });
            });
            
        });
    });

    // Update users
    app.put('/api/user/', function (req, res) {
        const collection = db.collection('users');
        var query = { name: req.body.name};
        var newvalues = { $set: { type: req.body.type } };
        collection.updateOne(query, newvalues, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
          });
        
    });

    app.delete('/api/user/:name', function (req, res) {
        // When Deleting a User, also check for the users in groups and channels

        // Lets just do users collection for now
        const usercollection = db.collection('users');
        const groupcollection = db.collection('groups');
        const channelcollection = db.collection('channels');
        let name = req.params.name;
        let query = {name:name}
        console.log('deleting' + query);
        // Find the users to get id
        // if found in any group delete
        // if found in any channel delete
        // delete that user from user collection 

        // usercollection.findOne(querry)
        //     .then(reponse =>{
        //         let id = respond.id
                
        //     })
        //     .then ( ()=> 

        //     )


        usercollection.deleteOne(query,function(err, result) {
            assert.equal(err, null);
            console.log("Deleted");
            // console.log(result);
            res.send(result);
        });

    });


};

