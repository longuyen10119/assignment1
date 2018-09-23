module.exports = function(app, db, io){
    const assert = require('assert');
    console.log("Server socket initialised");
    io.on('connection', function(){
        let chatHistory = db.collection('chats');

        // Create function to send status 
        sendStatus = function(s){
            socket.emit('status',s);
        }

        // Get chat history from mongo collection
        // Limit is getting only the first 100 messages
        // sorting by _id 
        // But later when seperating channels
        // We should find by channelname variable

        chatHistory.find().limit(100).sort({_id}).toArray( (err, result) =>{
            assert(err,null);
            
            // Emit the messsages
            socket.emit('output', result);
        });

        // Handle input events INPUT EVENT
        socket.on('input', function(data){
            let name = data.name;
            let message = data.message;

            // Check for name and message
            if (name=='' || message ==''){
                // Send error status
                sendStatus('Please enter a name and message');
            } else{ // When there is something
                // Insert this message into database
                chatHistory.insert({name:name, message: message}, function(){
                    // Send data back out to client
                    io.emit('output', [data]);

                    // Send status object
                    sendStatus({
                        message: 'Message sent',
                        clear: true
                    });
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
    });
}