module.exports = (app, fs) => {

    let obj;

    // returns a list of all users
    fs.readFile('data.JSON', 'utf-8', (err, data) => { if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data);
        }
    });
    console.log("Group");
    console.log(obj)

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
        for(let i=0; i<g.users.length;i++){
            let gid = g.users[i];
            let name = obj.users.find(x => x.id == gid)
            users.push(name);
        }
        console.log('Server side--------------')
        console.log(users);
        res.send(users);
    });
    // Add group via post
    app.post('/api/group', (req, res) => {
        console.log('new group in group.js ');
        console.log(req.body);
        // try to take out a newGroup to see if that still works with req.body
        // let newGroup = {'name': req.body.name,
        //                 'groupAdmin': req.body.groupAdmin }
        
        obj.groups.push(req.body);
        res.send(req.body);
        fs.writeFile('data.json', JSON.stringify(obj), 'utf8', (err) =>{
            if (err) throw err;
        })
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

