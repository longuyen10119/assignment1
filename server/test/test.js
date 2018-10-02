let chai = require('chai');
let chaiHttp = require('chai-http');
// let server = require('../server');
let should = chai.should();
let request = require('supertest')
// let request = require('supertest')("http://localhost:3000/");
let base_url = "http://localhost:3000";

chai.use(chaiHttp);

describe("User route", function () {
    it("returns list of users", function (done) {
        chai.request(base_url)
            .get('/api/users')
            .end((err, res) => {
                // console.log(res.body);
                res.should.have.status(200);
                res.body.should.be.a('array');
                // res.body.length.should.be.eql(0);
                done();
            });

    });
    it("add a user", function (done) {
        var newUser = {id: 4, name:'Rachael', type:'normal'};
        chai.request(base_url)
            .post('/api/user/')
            .send(newUser)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                // res.body.length.should.be.eql(0);
                done();
            });
    });
    // it("update a wrong user", function (done) {
    //     var newUser = {name:'Rachael', type:'groupadmin'};
    //     chai.request(base_url)
    //         .put('/api/user/')
    //         .send(newUser)
    //         .end((err, res) => {
    //             // console.log(res.body);
    //             if (err) throw err;
    //             res.should.have.status(404);
    //             // res.body.should.be.a('array');
    //             // res.body.length.should.be.eql(0);
    //             done();
    //         });

    // });
    it("Delete  a user", function (done) {
        var newUser = 'Rachael'
        chai.request(base_url)
            .delete('/api/user/Rachael')
            .end((err, res) => {
                if (err) throw err;
                res.body.ok.should.equal(1)
                done();
            });

    });
});


describe("Group route", function () {
    it("returns list of GROUPS", function (done) {
        chai.request(base_url)
            .get('/api/groups')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                // res.body.length.should.be.eql(0);
                done();
            });

    });
    it("Add a group", function (done) {
        var newGroup = {id: 5, name:'TestGroup', groupAdmin:2,users:[]};
        chai.request(base_url)
            .post('/api/group/')
            .send(newGroup)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.success.should.equal(true);
                // res.body.length.should.be.eql(0);
                done();
            });
    });
    it("Delete  a Group", function (done) {
        var group = 'TestGroup'
        chai.request(base_url)
            .delete('/api/user/TestGroup')
            .end((err, res) => {
                if (err) throw err;
                res.body.ok.should.equal(1)
                done();
            });

    });
});

describe("Channel route", function () {
    it("returns list of Channels in group 1", function (done) {
        chai.request(base_url)
            .get('/api/channels/1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                console.log(res.body)
                // res.body.length.should.be.eql(0);
                done();
            });

    });
    it("Add a channel", function (done) {
        var newChannel = {name:'TestChannel', groupid: 1, users:[]};
        chai.request(base_url)
            .post('/api/channel/')
            .send(newChannel)
            .end((err, res) => {
                console.log(res.body);
                res.should.have.status(200);
                res.body.success.should.equal(true);
                // res.body.length.should.be.eql(0);
                done();
            });
    });
    it("Delete  a channel", function (done) {
        var group = 'TestGroup'
        chai.request(base_url)
            .delete('/api/user/TestChannel')
            .end((err, res) => {
                if (err) throw err;
                console.log(res.body);
                res.body.ok.should.equal(1);
                done();
            });

    });
});