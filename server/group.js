module.exports = (app, fs) => {

    let obj;

    // returns a the data 
    fs.readFile('data.JSON', 'utf-8', (err, data) => { if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data);
        }
    });
    // console.log("Group");
    // console.log(obj)

    // Get Groups via get
    app.get('/api/groups', (req, res) => {
        console.log('Getting groups')
        res.send(obj.groups);
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
    app.post('/api/group/add'), (req, res) =>{
        console.log(req.body)

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
    }
    // Add group via post
    app.post('/api/group', (req, res) => {
        //when adding a new Group with a groupAdmin
        // i should check whether the admin exists in the users
        // if admin does not exist in users, add that user to users list
        // if admin does, add the admin to users members

        // try to take out a newGroup to see if that still works with req.body
        // let newGroup = req.body;
        
        // //check if new group admin is in users
        // let currentUser = obj.users.find(x => x.name == req.body.groupAdmin);
        // //if not found, add new user to users list 
        // if (currentUser == undefined){
        //     let id = 1;
        //     if (obj.users.length > 0) {
        //         let maximum = Math.max.apply(Math, obj.users.map(function (f) { return f.id; }));
        //         id = maximum + 1;
        //     }
        //     let newUser = {"id": id, "name": req.body.groupAdmin, "type": "groupAdmin"};
        //     obj.users.push(newUser);
        //     //then add user id to groupmembers
        //     newGroup.users.push(id);
        // }else{//if found in users list
        //     //add that users ID to group members
        //     newGroup.users.push(currentUser.id);
        // }
        
        //Getting a group obj with name, groupadmin, and empty list of users
        // req.body obj
        // create a newgroup: 4 things id from func, groupname from req.body.nam, groupadmin id from obj.users, emptylist of users
        // also need to update user to groupadmin if isn't already
        
        // pick a unique group id
        let id = 1;
        if (obj.groups.length > 0) {
            let maximum = Math.max.apply(Math, obj.groups.map(function (f) { return f.id; }));
            id = maximum + 1;
        }
        // find the groupadmin id and update the user to group admin
        let index = obj.users.findIndex(x => x.name==req.body.groupAdmin);
        let newGroup = {id: id,
                        name: req.body.name,
                        groupAdmin: obj.users[index].id,
                        users: [obj.users[index].id]}
        // currenlty not being able to change type for stupid reason
        obj.users[index].type = 'groupadmin';
        // sol 1 remove the user then add a new one

        let newUser = {id: obj.users[index].id, name: obj.users[index].name, type: 'groupadmin'}
        obj.users.push(newUser);
        obj.groups.push(newGroup);
        
        fs.writeFile('data.json', JSON.stringify(obj), 'utf8', (err) =>{
            if (err) throw err;
        })
        res.send(newGroup);
    });
    
    // Update groups via put (not working because cant id which record to change... add id to groups)
    app.put('/api/group/:name', function (req, res) {
        console.log('update group');
        let g = obj.groups.find(x => x.name == name);
        g.name = req.body.name;
        res.send(g);
    });
    // DELETE GROUP
    app.delete('/api/group/:name', function (req, res) {
        console.log('delete group');
        let groupn = req.params.name;
        console.log(groupn);
        // let g = students.find(x => x.id == id);
        obj.groups = obj.groups.filter(x => x.name != groupn);
        res.send(obj.groups);
        console.log(obj.groups);
        fs.writeFile('data.json', JSON.stringify(obj), 'utf8', (err) =>{
            if (err) throw err;
        })
    });


};

