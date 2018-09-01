module.exports = (app, fs) => {
    app.route('/api/login/:name').get(function(req, res){
        console.log("Login js");
        
        // localhost:3000/api/auth?username=Terry
        var requestedUser =  req.params['name'];
        console.log(requestedUser);
        var obj;

        fs.readFile('data.json', 'utf8', function(err, data){
            if(err) {
                
                console.log(err);
                res.send(null);
            } else {
                obj = JSON.parse(data)
                for (let i=0;i<obj.users.length;i++){
                    console.log(obj.users[i]);
                    if (obj.users[i].name == requestedUser){
                        //find first instance of user name and success
                        res.send(obj.users[i]);
                        return;
                    }
                }
                // no username was found
                res.send(null);
            }
        });
    });

}