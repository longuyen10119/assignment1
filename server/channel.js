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
    app.get('/api/channels', (req, res) => {
        console.log('Getting groups')
        res.send(obj.channels);
    })
    // createChannel
    app.post('/api/channel/add'), (req, res) =>{
            
    }
    // deleteChannel
    app.delete('api/channel', (req, res) =>{

    })
    // getUsersInChannel
    app.get('api/channel/users', (req, res) =>{

    })
    // addUserToChannel
    app.post('api/channel/adduser', (req, res) =>{

    })
    // deleteUserFromChannel
    app.delete('api/channel/deleteuser', (req, res) =>{
        
    })
   
   

}