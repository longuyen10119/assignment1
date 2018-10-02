let chai = require('chai')
let should = chai.should();
let chaiHttp = require('chai-http');
let assert = require('assert');
// let request = require('supertest')("http://localhost:3000/");
let base_url = "http://localhost:3000/";
let server = require('../server');
chai.use(chaiHttp);

    describe("User route", function() {
        it("returns list of users", function(done) {
            chai.request
                .get('/api/users')
                .end((err, res) => {
                    // res.should.have.status(200);
                    res.body.should.be.a('array');
                    // console.log('Hello');
                    // console.log(res.body);
                done();
              });
        });
      });