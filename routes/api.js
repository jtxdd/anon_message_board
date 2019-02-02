import MongoClient, { ObjectId } from 'mongodb';
const Thread = require('../models/Thread_Model.js');

module.exports = (app, db) => {
  const Threads = db.collection('threads');
  
  
  const boardThreads = (board) => {
    return new Promise((resolve, reject) => {
      Threads
        .find({ board })
        .sort([['bumped_on', -1]]) //.limit(10)
        .project({delete_password: 0, reported: 0, "replies.delete_password": 0, "replies.reported": 0})
        .toArray((err, docs) => {
        if (err) return reject(err);
        
        docs.forEach(thread => {
          thread.comments = thread.replies.length;
          thread.replies.sort((a,b) => new Date(b.created_on) - new Date(a.created_on));
          thread.replies = thread.replies.length > 3 ? thread.replies.slice(0, 3) : thread.replies;
        });
        
        return resolve({
          threads: docs.length > 10 ? docs.slice(0,10) : docs, 
          pages: Math.floor(docs.length / 10 ) + 1
        });
      });
    });
  };
  
  
  const singleThread = (thread_id) => {
    const projection = {
      delete_password: 0, 
      reported: 0, 
      "replies.delete_password": 0, 
      "replies.reported": 0
    };
    
    return new Promise((resolve, reject) => {
      Threads.findOne(thread_id, {projection}, (err, docs) => {
        if (err) return reject({ err, hasError: true });
        
        docs.replies.sort((a,b) => new Date(b.created_on) - new Date(a.created_on));
        
        return resolve({ docs, hasError: false});
      });
    });
  };
  
  
  const pushReply = (query, update) => {
    return new Promise((resolve, reject) => {
      Threads.updateOne(query, update, (err, docs) => {
        if (err) return reject({ err, hasError: true });
        docs = docs.result.nModified;
        return resolve({ docs, hasError: false });
      });
    });
  };
  
  
  const addThread = (new_thread) => {
    return new Promise((resolve, reject) => {
      Threads.insertOne(new_thread, (err, docs) => {
        if (err) return reject({ err, hasError: true });
        docs = docs.result.n;
      return resolve({ docs, hasError: false });
    });
    });
  };
  
  
  const updateReported = (query, update) => {
    return new Promise((resolve, reject) => {
      Threads.findOneAndUpdate(query, update, {returnOriginal: false}, (err, docs) => {
        if (err) return reject({ err, hasError: true });
        return resolve({ docs: docs.value, hasError: false });
      });
    });
  };
  
  
  const deleteThread = (query) => {
    return new Promise((resolve, reject) => {
      Threads.deleteOne(query, (err, docs) => {
        if (err) return reject({ err, hasError: true });
        docs = docs.deletedCount;
        return resolve({ docs, hasError: false });
      });
    });
  };
  
  
  const deleteReply = (query, reply) => {
    return new Promise((resolve, reject) => {
      
      Threads.findOne(query, (err, docs) => {
        if (err) return reject({ err, hasError: true });
        
        let updatedReply = docs.replies.find(el => el._id.toString() === reply._id);
        let password_match = updatedReply.delete_password === reply.delete_password;
        
        if (password_match) {
          updatedReply.text = '[deleted]';
          let update = { $set: { replies: docs.replies } };
          
          Threads.updateOne(query, update, (err, docs) => {
            if (err) return reject({ err, hasError: true });
            docs = docs.result.nModified;
            return resolve({ docs, hasError: false });
          });
        } else {
          return resolve({docs: 0, hasError: false });
        }
      });
    });
  };
  
  app.get('/', (req, res) => res.sendFile(process.cwd() + '/views/index.html'));
  
  
  app.get('/api/threads/:board', (req, res) => {
    const board = req.params.board;
    
    boardThreads(board)
      .then(data => {
        if (!data.threads.length) return res.json({error: 'request failed'});
        return res.json(data);
      });
  });
  
  
  app.get('/api/replies/:board', (req, res) => {
    const thread_id = { _id: ObjectId(req.query.thread_id) };
    
    singleThread(thread_id)
      .then(data => {
        if (data.hasError) return res.json({error: 'request failed'});
        return res.json(data.docs);
      });
  });
  
  
  app.post('/api/replies/:board', (req, res) => {
    let query = { _id: ObjectId(req.body.thread_id) };
    let update = {
      $push: { 
        replies: {
          _id: ObjectId(),
          text: req.body.text,
          created_on: new Date(),
          delete_password: req.body.delete_password,
          reported: false
        }
      },
      $set:  { bumped_on: new Date() }
    };
    const board = req.params.board;
    
    if (req.query.thread_id) {
      pushReply(query, update)
        .then(result => {
          if (result.hasError) return res.json({error: 'request failed'});
          return res.json(result);
        });
    } else {
      pushReply(query, update)
        .then(result => {
          if (!result.docs) return res.json({error: 'request failed'});
          return res.json(result.docs);
        });
    }
    
  });
    
    
  app.post('/api/threads/:board', (req, res) => {
    let new_thread = new Thread({
      board: req.params.board,
      text:  req.body.text,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false,
      delete_password: req.body.delete_password,
      replies: []
    });
    
    addThread(new_thread)
      .then(data => {
        if (data.hasError) return res.json({ error: 'request failed' });
        return res.json(data.docs);
      });
  });
  
  
  app.put('/api/threads/:board', (req, res) => {
    let query = {_id: ObjectId(req.body.thread_id)};
    let update = {$set: {reported: true}};
    
    updateReported(query, update)
      .then(data => {
        if (data.hasError) return res.json({ error: 'request failed' });
        if (data.docs.reported) {
          return res.json({message: 'Success'});
        } else {
          return res.json({message: 'Failed'});
        }
      });
  });
  
  app.put('/api/replies/:board', (req, res) => {
    let query = {_id: ObjectId(req.body.thread_id), "replies._id": ObjectId(req.body.reply_id)};
    let update = {$set: {"replies.$.reported": true}};
    
    updateReported(query, update)
      .then(data => {
        if (data.hasError) return res.json({ error: 'request failed' });
        let reported = data.docs.replies.find(el => el._id.toString() === req.body.reply_id).reported;
        if (reported) {
          return res.json({message: 'Success'});
        } else {
          return res.json({message: 'Failed'});
        }
      });
  });
  
  
  app.delete('/api/threads/:board', (req, res) => {    
    let query = {};
    let update = {};
    let reply = {
      _id: req.body.reply_id, 
      delete_password: req.body.delete_password
    };
    
    if (req.body.reply_id) {
      query = { _id: ObjectId(req.body.thread_id) };
      
      deleteReply(query, reply)
        .then(data => {
          if (data.hasError) return res.json({ error: 'request failed' });
          return res.json(data.docs);
        });
    } else {
      query = {
        _id: ObjectId(req.body.thread_id),
        delete_password: req.body.delete_password
      };
      
      deleteThread(query)
        .then(data => {
          if (data.hasError) return res.json({ error: 'request failed' });
          if (data.docs) {
            res.json({message: 'Success'});
          } else {
            return res.json({message: 'Incorrect Password'});
          }
        });
    }
  });
  
  app.delete('/api/replies/:board', (req, res) => {        
    let query = {};
    let update = {};
    let reply = {
      _id: req.body.reply_id, 
      delete_password: req.body.delete_password
    };
    
    if (req.body.reply_id) {
      query = { _id: ObjectId(req.body.thread_id) };
      
      deleteReply(query, reply)
        .then(data => {
          if (data.hasError) return res.json({ error: 'request failed' });
          if (data.docs) {
            return res.json({message: 'Success'});
          } else {
            return res.json({message: 'Incorrect Password'});
          }
        });
    } else {
      query = {
        _id: ObjectId(req.body.thread_id),
        delete_password: req.body.delete_password
      };
      
      deleteThread(query)
        .then(data => {
          if (data.hasError) return res.json({ error: 'request failed' });
          return res.json(data.docs);
        });
    }
  });
  
  
  app.use((req, res) => res.status(404).type('text').send('Not Found'));
};