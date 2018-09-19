module.exports = function(app, db){

    // THIS IS USER AUTHENTICATION
    const assert = require('assert');
    app.post('/api/auth/', (req, res) => {
        const collection = db.collection('users');
        let name =  req.body.name;
        let pass = req.body.pass;
        console.log(name + ' ' + pass);
        let querry = {name:name, pass:pass};
        collection.find(querry).count( (err,count)=>{
            assert.equal(null,err);
            if (count>0){
                collection.findOne(querry, {projection:{_id:0, pass:0}}, (err,result)=>{
                    res.send(result);
                });
            }else{
                res.send({name:'', success:false});
            }
        });
    });
}