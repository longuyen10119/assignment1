module.exports = (app, db) => {
    const assert = require('assert');


    // Get Channels
    app.get('/api/channels/:id', (req, res) => {
        let id = parseInt(req.params.id);
        const collection = db.collection('channels');
        collection.find({
            groupid: id
        }, {
            projection: {
                '_id': 0
            }
        }).toArray(function (err, docs) {
            assert.equal(err, null);
            console.log("Found the following channels");
            console.log(docs);
            res.send(docs)
        });
    });

    // Add channel via post
    app.post('/api/channel', (req, res) => {
        const collection = db.collection('channels');
        // console.log(req.body);
        let query = req.body;
        collection.insertOne(query, (err, result) => {
            assert.equal(err, null);
            console.log("Add channel succesful");
            res.send({
                success: true
            })
        });
    });

    // Update channel via put 
    app.put('/api/channel/', function (req, res) {

        let newChannel = req.body
        const collection = db.collection('channels');
        collection.deleteOne({
            name: newChannel.name
        }, (err, result) => {
            assert.equal(err, null);
            console.log('delete first');
            collection.insertOne(newChannel, (err, result) => {
                assert.equal(err, null);
                console.log("Update channel succesful");
                collection.find({groupid:newChannel.groupid}, {
                    projection: {
                        '_id': 0
                    }
                }).toArray((err, result) => {
                    assert.equal(err, null);
                    res.send(result);
                })
            });
        });
    });
    // DELETE Channels
    app.delete('/api/channel/:name', function (req, res) {
        let query = {
            name: req.params.name
        };
        const collection = db.collection('channels');
        collection.deleteOne(query, function (err, result) {
            assert.equal(err, null);
            console.log("Deleted succesful");
            // console.log(result);
            res.send(result);
        });
    });


};