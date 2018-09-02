module.exports = (app, fs) => {
    let obj;
    //read data.JSON file, pass the data into obj
    fs.readFile('data.JSON', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data);
        }
    });

    // Get User via get
    app.get('/api/users', (req, res) => {
        console.log('get users on server');
        res.send(obj.users);
    });

    // Add User via post
    app.post('/api/user', (req, res) => {
        console.log('New User');
        let id = 1;
        if (obj.users.length > 0) {
            let maximum = Math.max.apply(Math, obj.users.map(function (f) { return f.id; }));
            id = maximum + 1;
        }
        let newUser = {"id": id, "name": req.body.name, "type": "normal"};
        obj.users.push(newUser);
        res.send(newUser);
        fs.writeFile('data.json', JSON.stringify(obj), 'utf8', (err) =>{
            if (err) throw err;
        })
    });

    // Authenticate users
    // app.put('/api/group/:name', function (req, res) {
    //     console.log('update group');
    //     let g = obj.groups.find(x => x.groupname == groupname);
    //     g.groupname = req.body.groupname;
    //     res.send(g);
    // });

    app.delete('/api/user/:username', function (req, res) {
        console.log('delete user');
        let usern = req.params.username;
        console.log(usern);
        // let g = students.find(x => x.id == id);
        obj.users = obj.users.filter(x => x.name != usern);
        res.send(obj.users);
        console.log(obj.users);
        
        //now gotta find if the user is in any group and then delete
        // first find user ID of this current user
        // let currentuser = obj.users.find(x => x.name ==usern);
        // let id = currentuser.id;
        // // go through every group
        // for (let i =0; i<obj.groups.length;i++){
        //     obj.groups[i].users = obj.groups[i].users.filter(x => x!=id);
        // }

        fs.writeFile('data.json', JSON.stringify(obj), 'utf8', (err) =>{
            if (err) throw err;
        })
    });


};

