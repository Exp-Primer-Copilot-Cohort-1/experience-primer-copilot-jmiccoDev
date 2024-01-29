// Create web server

// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Comment = require('./models/comment.js');

// Create web server
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/comments', { useNewUrlParser: true });

// Configure web server
app.use(bodyParser.json());

// GET /comments
app.get('/comments', (req, res) => {
  Comment.find({}, (err, comments) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(comments);
    }
  });
});

// POST /comments
app.post('/comments', (req, res) => {
  const comment = new Comment(req.body);
  comment.save((err, comment) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(comment);
    }
  });
});

// GET /comments/:id
app.get('/comments/:id', (req, res) => {
  Comment.findById(req.params.id, (err, comment) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(comment);
    }
  });
});

// PUT /comments/:id
app.put('/comments/:id', (req, res) => {
  Comment.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, comment) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(comment);
    }
  });
});

// DELETE /comments/:id
app.delete('/comments/:id', (req, res) => {
  Comment.findByIdAndRemove(req.params.id, (err, comment) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ message: 'Comment successfully deleted' });
    }
  });
});

// Start web server
app.listen(3000, () => {
  console.log('Comments API listening on port 3000!');
}); 