/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

  
  
  suite('API ROUTING FOR /api/threads/:board', () => {
    
    test('POST', (done) => {
      chai.request(server)
      .post('/api/threads/sports')
      .send({text: 'Chai testing post', delete_password: 'chai'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        done();
      });
    });
    
    test('GET', (done) => {
      chai.request(server)
      .get('/api/threads/general')
      .end((err, res) => {
        let { threads } = res.body;
        
        assert.equal(res.status, 200);
        
        assert.isArray(threads);
        assert.isAtMost(threads.length, 10);
        
        threads.forEach(thread => {
          assert.isAtMost(thread.replies.length, 3);
          
          assert.notProperty(thread, 'delete_password');
          assert.notProperty(thread, 'reported');
          
          if (thread.replies.length) {
            thread.replies.forEach(reply => {
              assert.notProperty(reply, 'delete_password');
              assert.notProperty(reply, 'reported');
            });
          }
        });
        done();
      });
    });
    
    //test correct pw
    test('DELETE', (done) => {
      chai.request(server)
      .delete('/api/threads/politics')
      .send({thread_id: '5c5605628ff68f4393b767d0', delete_password: 'pw'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.message, 'Success');
        done();
      });
    });
    
    //test incorrect pw
    test('DELETE', (done) => {
      chai.request(server)
      .delete('/api/threads/politics')
      .send({thread_id: '5c5605e25b9bc446eddf7fc9', delete_password: '123'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.message, 'Incorrect Password');
        done();
      });
    });
    
    
    
    test('PUT', (done) => {
      chai.request(server)
      .put('/api/threads/politics')
      .send({thread_id: '5c50d13a2bdb27396fab797f'})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.message, 'Success');
        done();
      });
    });
    

  });
  
  
  
  
  
  suite('API ROUTING FOR /api/replies/:board', () => {
    
    test('POST', (done) => {
      chai.request(server)
      .post('/api/replies/politics')
      .send({
        thread_id: '5c5605e25b9bc446eddf7fc9', 
        text: 'chai testing text', 
        delete_password: 'chai'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        done();
      });
    });
    
    test('GET', (done) => {
      chai.request(server)
      .get('/api/replies/general?thread_id=5c3d13b96cde9102677e3340')
      .end((err, res) => {
        let thread = res.body;
        
        assert.equal(res.status, 200);
        assert.notProperty(thread, 'delete_password');
        assert.notProperty(thread, 'reported');
        
        thread.replies.forEach(reply => {
          assert.notProperty(reply, 'delete_password');
          assert.notProperty(reply, 'reported');
        });
        done();
      });
    });
    
    test('PUT', (done) => {
      chai.request(server)
      .put('/api/replies/politics')
      .send({
        thread_id: '5c5605e25b9bc446eddf7fc9', 
        reply_id: '5c5608e3684db4623124a83f'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.message, 'Success');
        done();
      });
    });
    
    //test incorrect pw
    test('DELETE', (done) => {
      chai.request(server)
      .delete('/api/replies/politics')
      .send({
        thread_id: '5c5605e25b9bc446eddf7fc9',
        reply_id: '5c5608e3684db4623124a83f',
        delete_password: '1234'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.message, 'Incorrect Password');
        done();
      });
    });
    
    //test correct pw
    test('DELETE', (done) => {
      chai.request(server)
      .delete('/api/replies/politics')
      .send({
        thread_id: '5c5605e25b9bc446eddf7fc9',
        reply_id: '5c5608e3684db4623124a83f',
        delete_password: 'chai'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.message, 'Success');
        done();
      });
    });
    
  });
  
  
  
  
  

});
