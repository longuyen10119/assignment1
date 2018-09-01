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

    // Add group via post
    app.post('/api/group', (req, res) => {
        console.log('new group');
        let newGroup = {"name": req.body.name};
        console.log(req.body);
        obj.groups.push(newGroup);
        res.send(newGroup);
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

