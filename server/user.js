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

