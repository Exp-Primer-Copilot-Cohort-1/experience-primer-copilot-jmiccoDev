// Create Web Server

// 1. Import Express
const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

// 2. Create App
const app = express();

// 3. Create Array
const commentsByPostId = {};

// 4. Middleware
app.use(express.json());
app.use(cors());

// 5. Route Handler
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

// 6. Route Handler
app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    // Get comments from commentByPostId
    const comments = commentsByPostId[req.params.id] || [];

    // Add new comment
    comments.push({ id: commentId, content, status: 'pending' });

    // Update commentsByPostId
    commentsByPostId[req.params.id] = comments;

    // Emit event
    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            status: 'pending'
        }
    });

    // Send response
    res.status(201).send(comments);
});

// 7. Route Handler
app.post('/events', async (req, res) => {
    console.log('Event Received:', req.body.type);

    const { type, data } = req.body;

    if (type === 'CommentModerated') {
        const { postId, id, status, content } = data;

        const comments = commentsByPostId[postId];

        const comment = comments.find(comment => {
            return comment.id === id;
        });

        comment.status = status;

        await axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                status,
                postId,
                content
            }
        });
    }

    res.send({});
});

// 8. Listen to Port
app.listen(4001, () => {
    console.log('Listening on 4001');
});
    