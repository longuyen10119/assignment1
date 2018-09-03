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
        let listOfUsers = [];
        for(let i =0; i<req.body.users.length;i++){
            let userid = req.body.users[i];
            let temp = obj.users.filter(x => x.id ==userid);
            listOfUsers.push(temp);
        }
        console.log(listOfUsers)
        res.send(listOfUsers);
    });
    // addUserToChannel
    app.post('/api/channel/adduser', (req, res) =>{

    });
    // deleteUserFromChannel
    app.delete('/api/channel/deleteuser', (req, res) =>{
        
    });
   
   

}