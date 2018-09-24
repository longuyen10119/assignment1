module.exports=(app, db)=>{
    const assert = require('assert');
    const multer = require('multer');
    const storage = multer.diskStorage({
        destination: (req, file, cb)=>{
            cb(null, './uploads/');
        },
        filename: (req, file, cb)=>{
            cb(null, '' + file.originalname);
        }
    });
    const upload = multer({storage: storage})

    const profile = db.collection('profiles');
    // Adding 1 so collection would be created
    profile.countDocuments(function (err, count) {
        if (err) {return console.log(err);}
        if (count === 0) {
            profile.insertOne({
                id: '0',
                filePath: 'Test'
            }, function (err, result) {
                assert.equal(err, null);
                console.log("Inserted 1 image");
            });
        }
    });
    // Route to get profile image
    app.get('/api/upload/:id', (req, res)=>{
        let id = req.params.id;
        let query = {id: id}
        profile.findOne(query,{projection:{_id:0}},(err,result)=>{
            if (err) throw err;
            // Send back null if not found
            res.send(result);
        });
    });
    // Route to upload an image and also update if image exists
    app.post('/api/upload',upload.single('profileImage'),(req, res)=>{
        console.log('In API FOR UPLOAD');
        let name = req.body.name;
        let id = req.body.id;
        // console.log(req);
        // console.log(req.body);
        console.log(req.file);
        console.log('FILE PATH IS ' + req.file.path );
        // let query = {id:id, path: req.file.path};
        let query = {id:id}
        profile.findOne(query,(err,result)=>{
            // assert(err,null);
            // console.log(result);
            if(result==null){//if id doesn't exist in database Add one
                let query1 = {id:id, path: req.file.path}
                profile.insertOne(query1, (err, result)=>{
                    assert.equal(err,null);
                    res.send(result);
                 });
            }else{ //if it does, do an update with the new file path
                let query3 = {id:id} 
                let newvalue = { $set: { path: req.file.path } };
                profile.updateOne(query3, newvalue, (err,result)=>{
                    if (err) throw err;
                    let back = {succes: true, path: req.file.path}
                    res.send(back);
                }); 
            }
        });
        
        
    });
}