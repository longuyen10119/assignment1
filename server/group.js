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
    // Return users in the group
    app.post('/api/group/users', (req, res) => {
        //get the group name thru api
        let gname = req.body.name;
        console.log('Server side--------------')
        console.log(gname);
        // find the group with matching name then return it to g
        let g = obj.groups.find(x => x.name == gname);
        let users = [];
        let newgroupuserlist = [];
        for(let i=0; i<g.users.length;i++){
            let gid = g.users[i];
            //check if gid exists in user list
            let name = obj.users.find(x => x.id == gid)
            if(name != undefined){
                newgroupuserlist.push(name.id);
                users.push(name);
            }
        }
        obj.groups.users = newgroupuserlist;
        res.send(users);
    });
    // Add user to a group
    app.post('/api/group/add', (req, res) =>{
        console.log(req.body);
        let name = req.body.name;
        let type = req.body.type;
        let groupToAdd = req.body.group;
        let user = obj.users.find(x => x.name ==name);
        let id = user.id;
        let groupindex = obj.groups.findIndex(x => x.id == groupToAdd.id);
        obj.groups[groupindex].users.push(id);
        fs.writeFile('data.json', JSON.stringify(obj), 'utf8', (err) =>{
            if (err) throw err;
        })
        res.send(obj.groups[groupindex]);
    });
    // Remove user from a group
    app.post('/api/group/remove', (req, res) =>{
        // coming thru object has user id and the group
        let userid = req.body.id;
        let groupindex = obj.groups.findIndex(x => x.id==req.body.group.id);
        
        obj.groups[groupindex].users = obj.groups[groupindex].users.filter(x => x!=userid);
        fs.writeFile('data.json', JSON.stringify(obj), 'utf8', (err) =>{
            if (err) throw err;
        })
        res.send(obj.groups[groupindex]);
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

