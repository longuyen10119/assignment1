module.exports = function(app, db, io){
    const assert = require('assert');
    console.log("Server socket initialised");
    // Connection to socket.io
    io.on('connection', (socket)=>{
        console.log('User connected!!!!!!')
        const chatHistory = db.collection('chats');
        // Create function to send status 
        sendStatus = function(s){
            socket.emit('status',s);
        }
        
        // Get chat history from mongo collection
        // Limit is getting only the first 100 messages
        // sorting by _id 
        // But later when seperating channels
        // We should find by channelname variable

        chatHistory.find({},{projection:{_id:0}}).limit(100).sort({_id:1}).toArray( (err, result) =>{
            // assert(err,null);
            // Emit the messsagesç
            socket.emit('load', result);
            // socket.emit('message', 'test');
        });

        // Handle input events INPUT EVENT
        socket.on('incoming', function(data){
            let channel = data.channel;
            let username = data.username;
            let message = data.message;
            let path = data.path;
            // Check for name and message
            if (channel=='' || message ==''){
                // Send error status
                sendStatus('Please enter a name and message');
            } else{ // When there is something
                // Insert this message into database
                let query = {channel: channel, username: username, message: message, path:path};
                chatHistory.insertOne(query, function(){
                    // chatHistory.find({},{projection:{_id:0}}).limit(100).sort({_id:1}).toArray( (err, result) =>{
                    //     socket.emit('message', result);
                    // });
                    let sendback = {channel: channel, username: username, message: message, path:path};
                    io.emit('message', sendback);
                });

            }
        });

        // Handle clear
        socket.on('clear', function(data){
            // Remove all chats from collection
            chatHistory.remove({}, function(){
                socket.emit('cleared');
            });
        });
        socket.on('login', function(data){
            socket.broadcast.emit('status', data);
        });
        // // Handl add-message event
        // socket.on('add-message', (message)=>{
        //     io.emit('message', {type:'message', text: message});
        // });
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
    });
}