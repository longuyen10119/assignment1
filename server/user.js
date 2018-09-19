module.exports = (app, db) => {
    const assert = require('assert');
    // Get Users via get
    app.get('/api/users', (req, res) => {
        const collection = db.collection('users');
        collection.find({}, {projection:{'_id':0}}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Found the following records");
            console.log(docs);
            res.send(docs)
        });
    });

    // Add User via post
    app.post('/api/user/add/:name', (req, res) => {
        // Let's just send a name through
        const collection = db.collection('users');
        let name = req.params.name;
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
                collection.find({}, {projection:{_id:0}}).toArray(function(err, result) {
                    assert.equal(err, null);
                    console.log("Return new");
                    res.send(result);
                });
            });
            
        });
    });

    // Update users
    app.put('/api/group/:name', function (req, res) {
        // console.log('update student');
        // let id = req.params.id;
        // let s = students.find(x => x.id == id);
        // s.name = req.body.name;
        // s.gpa = req.body.gpa;
        // res.send(s);
        console.log('update User');
        let index = obj.users.findIndex(x => x.id = req.body.id);
        obj.users[index].type = 'groupadmin';
        fs.writeFile('data.json', JSON.stringify(obj), 'utf8', (err) =>{
            if (err) throw err;
        })
        res.send(obj.users[index]);
    });

    app.delete('/api/user/:username', function (req, res) {
        console.log('delete user');
        let usern = req.params.username;
        console.log(usern);
        let tempuser = obj.users.find(x => x.name ==usern);
        let id = tempuser.id;
        obj.users = obj.users.filter(x => x.name != usern);
        
        for(let i =0;i< obj.groups.length;i++){
            if(obj.groups[i].groupAdmin == id){
                obj.groups[i].groupAdmin = 0;
            }
            let newindex = obj.groups[i].users.findIndex(x => x==id);
            obj.groups[i].users.splice(newindex,1);
        }
        //now gotta find if the user is in any group and then delete
        // first find user ID of this current user
        
        
        fs.writeFile('data.json', JSON.stringify(obj), 'utf8', (err) =>{
            if (err) throw err;
        })
        res.send(obj.users);
    });


};

