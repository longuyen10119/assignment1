module.exports = (app, db) => {
    const assert = require('assert');


    // Get Groups via get
    app.get('/api/groups', (req, res) => {
        const collection = db.collection('groups');
        collection.find({}, {projection:{'_id':0}}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Found the following groups");
            console.log(docs);
            res.send(docs)
        });
    });
    
    // Add group via post
    app.post('/api/group', (req, res) => {
        const collection = db.collection('groups');
        console.log(req.body);
        collection.findOne({},{sort:{$natural:-1},projection:{_id:0}} ,function(err, result) { // find the last item
            assert.equal(err, null);
            let newid = result.id +1;
            let query = {id:newid, name:req.body.name, groupAdmin:req.body.groupAdmin, users: req.body.users}
            collection.insertOne(query, (err,result)=>{
                assert.equal(err,null);
                console.log("ADd succesful");
                res.send({success:true})
            });
            
        });
    });
    
    // Update groups via put 
    app.put('/api/group/', function (req, res) {
        let newGroup = req.body
        console.log(newGroup)
        const collection = db.collection('groups');
        collection.deleteOne({name:newGroup.name}, (err,result)=>{
            assert.equal(err,null);
            collection.insertOne(newGroup, (err,result)=>{
                assert.equal(err,null);
                res.send({success:true})
            });
        });
    });
    // DELETE GROUP
    app.delete('/api/group/:name', function (req, res) {
        let query = {name:req.params.name};
        const groupcollection = db.collection('groups');
        groupcollection.deleteOne(query,function(err, result) {
            assert.equal(err, null);
            console.log("Deleted");
            // console.log(result);
            res.send(result);
        });

        
    });


};

