var express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const blog = require('../models/blog');

var router = express.Router();

router.route('/create')
  .get((req, res, next) => {
    res.render('index.ejs', { title: 'Create Entry' });
  })

  .post((req, res, next) => {
    blog.create(req.body)
      .then((blogcreated) => {
        blog.find()
          .then((blogsfound) => {
            res.render('blogcreated', { 'bloglist': blogsfound, title: 'All Blogs' });
          }, (err) => next(err))
          .catch((err) => next(err));
      }, (err) => next(err))
      .catch((err) => next(err));
  })
  /*.post((req, res, next) => {
    res.end('post')  
  })*/
  .put((req, res, next) => {
    res.end('put')
  })
  .delete((req, res, next) => {
    res.end('delete')
  });

router.route('/list')
  .get((req, res, next) => {
    res.render('blogcreated.ejs', { title: 'Blog List' });
  })

  

  router.route('/delete')
  .get((req,res,next) => {
    blog.find()
    .then((blogsfound) => {
      res.render('blogcreated.ejs', {'bloglist': blogsfound, title: 'Delete Blog' });
    }, (err) => next(err))
  })

  router.route('/delete/:id')
  .get((req,res,next) => {
      console.log('Del Test 1')
      blogId = req.params.id
      console.log(blogId)
      blog.findById(blogId)
      .then((blogsfound) => {
            res.render('delete.ejs', {'bloglist' : blogsfound, title: 'Delete Blog'});
      }, (err) => next(err))
  })

  router.route('/delete/:id')
  .post((req,res,next) => {
    console.log('Del Test 2')
      blogId = req.params.id
      console.log(blogId)
      blog.findByIdAndDelete(blogId,req.body)
      .then((blogsfound) => {
        res.render('blogcreated.ejs', {'bloglist': blogsfound, title: 'All Blogs' });
      }, (err) => next(err))
  })
    
  router.route('/modify')
  .get((req,res,next) => {
    blog.find()
    .then((blogsfound) => {
      res.render('blogcreated.ejs', {'bloglist': blogsfound, title: 'Modify Blog' });
    }, (err) => next(err))
  })

  router.route('/modify/:id')
  .get((req,res,next) => {
      console.log('Mod Test 1')
      blogId = req.params.id
      console.log(blogId)
      blog.findById(blogId)
      .then((blogsfound) => {
            res.render('modify.ejs', {'bloglist' : blogsfound, title: 'Modify Blog'});
      }, (err) => next(err))
  })

  router.route('/modify/:id')
  .post((req,res,next) => {
    console.log('Mod Test 2')
      blogId = req.params.id
      console.log(blogId)
      blog.findByIdAndUpdate(blogId,req.body)
      .then((blogsfound) => {
        res.render('blogcreated.ejs', {'bloglist': blogsfound, title: 'All Blogs' });
      }, (err) => next(err))
  })

  router.route('/search/:name')
  .post((req,res,next) => {
    console.log('Search 1 ')
    blogId = req.params.id
      console.log(blogId)
      blog.findById(blogId,req.body)
    .then((blogsfound) => {
        res.render('searchresults.ejs', {'bloglist': blogsfound, title: 'Search Results'})
      }, (err) => next(err))
      .catch((err) => next(err));

  })

  .post((req, res, next) => {
    blog.create(req.body)
      .then((blogcreated) => {
        blog.find()
          .then((blogsfound) => {
            res.render('blogcreated', { 'bloglist': blogsfound, title: 'All Blogs' });
          }, (err) => next(err))
          .catch((err) => next(err));
      }, (err) => next(err))
      .catch((err) => next(err));
  })



module.exports = router;
