module.exports = (app, fs) => {

    let obj;
    // returns a the data 
    fs.readFile('data.JSON', 'utf-8', (err, data) => { if (err) {
            console.log(err);
        } else {
            obj = JSON.parse(data);
        }
    });
    // List of services-----------
    // getChannels
    // createChannel
    // deleteChannel
    // getUsersInChannel
    // addUserToChannel
    // deleteUserFromChannel
    // getChannels
    // ---------------------------

    // getChannels
    app.get('/api/channels/:groupname', (req, res) => {
        let gname = req.params.groupname;
        console.log(obj.channels);
        console.log('group name needs to list channels' + gname);
        // find group id
        let group = obj.groups.find(x => x.name ==gname);
        console.log('Group id is ' + group.id);
        let channels = obj.channels.filter(x => x.groupid == group.id);
        res.send(channels);
    });
    // createChannel
    app.post('/api/channel', (req, res) =>{
        // received obj is {channel, group}
        let channelname = req.body.channel;
        let groupname = req.body.group;
        
        // need group id
        let thisgroup = obj.groups.find(x => x.name == groupname);
        let groupid = thisgroup.id;
        // find all channels in this group
        let channelsInGroup = obj.channels.filter(x => x.groupid==groupid);
        let tempchannel = channelsInGroup.filter(x => x.name == channelname);
        if(tempchannel.length==0){
            let newchannel = {name: channelname, groupid: groupid, users: []};
            obj.channels.push(newchannel);
            // write the file
            fs.writeFile('data.json', JSON.stringify(obj), 'utf8', (err) =>{
                if (err) throw err;
            })
            res.send(newchannel);
        }else
            res.send(null);
    });
    // deleteChannel
    app.post('/api/channeldelete', (req, res) =>{
        console.log('here in channel deleltejjbugugguyguyg');
        let channelname = req.body.channel;
        let groupname = req.body.group;
        // need group id
        let thisgroup = obj.groups.find(x => x.name == groupname);
        let groupid = thisgroup.id;
        // find all channels in this group
        let channelsInGroup = obj.channels.filter(x => x.groupid==groupid);
        // delete the channel
        obj.channels = obj.channels.filter(x => x.name!=channelname || x.groupid!=groupid);
        console.log(obj.channels);
        // write the file
        fs.writeFile('data.json', JSON.stringify(obj), 'utf8', (err) =>{
            if (err) throw err;
        })
        res.send(obj.channels);
    });
    // getUsersInChannel
    app.post('/api/channel/users', (req, res) =>{
        //need to send back a list of users
        let listOfUsers = []; /// 
        for(let i =0; i<req.body.users.length;i++){
            let userid = req.body.users[i];
            let index = obj.users.findIndex(x => x.id==userid);
            let temp = {id: obj.users[index].id, name: obj.users[index].name, type: obj.users[index].type};
            listOfUsers.push(temp);
        }
        res.send(listOfUsers);
    });
    // addUserToChannel
    app.post('/api/channel/adduser', (req, res) =>{
        // let temp = {user: name, channel: this.currentChannel.name, groupname: this.currentGroup};
        let usern = req.body.user;
        let channelname = req.body.channel;
        let groupname = req.body.groupname;

        // find group index
        let indextempGroup = obj.groups.findIndex(x => x.name==groupname);
        //if user doesn't exist 
        let tempUser = obj.users.find(x => x.name==usern);
        if(typeof tempUser =="undefined"){// if user doesn't exit 
            // make new user
            let id = 1;
            if (obj.users.length > 0) {
                let maximum = Math.max.apply(Math, obj.users.map(function (f) { return f.id; }));
                id = maximum + 1;
            }
            let newUser = {"id": id, "name": usern, "type": "normal"};
            obj.users.push(newUser);
            
            // add user id to the group
            obj.groups[indextempGroup].users.push(id);
            // add user to channel
            // find channel index
            console.log('Channel ' + channelname);
            console.log('group id ' + obj.groups[indextempGroup].id);
            let channelindex = obj.channels.findIndex(x => x.name==channelname && x.groupid == obj.groups[indextempGroup].id);
            obj.channels[channelindex].users.push(id);
        }else{
            // if users exists in users, find user
            // need to add user to current group if not already in there
            let channelUser = obj.groups[indextempGroup].users.find(x =>x ==tempUser.id);
            
            if(typeof channelUser =='undefined'){ //if not exist in the current group
                obj.groups[indextempGroup].users.push(tempUser.id);
            }
            // add user the channel
            let channelindex = obj.channels.findIndex(x => x.name==channelname && x.groupid == obj.groups[indextempGroup].id);
            obj.channels[channelindex].users.push(tempUser.id);
        }
        fs.writeFile('data.json', JSON.stringify(obj), 'utf8', (err) =>{
            if (err) throw err;
        })
        res.send(req.body);

    });
    // deleteUserFromChannel
    app.post('/api/channel/deleteuser', (req, res) =>{
        // let temp = {user: user.id, channel: this.currentChannel.name, groupname: this.currentGroup};
        let userid = req.body.user;
        let channelName = req.body.channel;
        let groupName = req.body.groupname;
        // find group id
        let group = obj.groups.find(x => x.name==groupName);
        let index = obj.channels.findIndex(x => x.name==channelName && x.groupid==group.id);
        console.log(obj.channels[index]);
        obj.channels[index].users = obj.channels[index].users.filter(x => x!=userid);
        console.log(obj.channels[index]);
        fs.writeFile('data.json', JSON.stringify(obj), 'utf8', (err) =>{
            if (err) throw err;
        })
        res.send(group);
    });
   
   

}