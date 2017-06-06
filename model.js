'use strict';

const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  },
  content: {type: String, required: true}
});

blogSchema
  .virtual('authorName')
  .get(function(){
    return `${this.author.firstName} ${this.author.lastName}`;
  })
  .set(function(authorName){
    const [first, last] = authorName.split(' ');
    this.firstName = first;
    this.lastName = last;
  });

blogSchema.methods.apiRepr = function(){
  return {
    title: this.title,
    author: this.authorName,
    content: this.content
  };
};



const Blog = mongoose.model('Blog', blogSchema);

module.exports = {Blog};