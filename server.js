'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Blog} = require('./model.js');

const app = express();
app.use(bodyParser.json());

app.get('/posts', (req, res) => {
  Blog
    .find({})
    .then(blogs=> {
      console.log(blogs);
      res.json({blogs: blogs.map(
        (blog)=> blog.apiRepr()
      )});
    });
});

app.get('/posts/:id', (req,res) => {
  Blog
    .findById(req.params.id)
    .then(blog=>{
      res.json(blog.apiRepr());
    });
});

app.post('/posts', (req,res)=> {

  console.log(req.body);

  const required = ['title','content','author'];

  required.forEach(
    field=>{
      if (!(field in req.body)){
        const message = `Required Field Missing: ${field}`;
        console.error(message);
        return res.status(400).send(message);
      }
    }
  );

  Blog
    .create({
      title: req.body.title,
      content: req.body.content,
      author: req.body.author
    })
    .then(
      blog=>{
        res.status(201).json(blog.apiRepr());
      }
    );
});



let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
         if (err) {
             return reject(err);
           }
         resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};