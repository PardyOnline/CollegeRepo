var express = require('express');

const blog = require('../models/blog');

const helpRouter = express.Router();

helpRouter.use(express.json());

helpRouter.route('/')
    .get((req, res, next) => {
        res.render('help.ejs', { title: 'Help' });
    })
    .post((req, res, next) => {
        res.end('post')
    })
    .put((req, res, next) => {
        res.end('put')
    })
    .delete((req, res, next) => {
        res.end('delete')
    });


helpRouter.route('/list')
    .get((req, res, next) => {
        blog.find()

            .then((blogsfound) => {
                res.render('blogcreated', { 'bloglist': blogsfound, title: 'All Blogs' });
            }, (err) => next(err))
    });
/* GET home page. */
/*aboutRouter.get('/about', function(req, res, next) {
  res.render('about', { title: "Sean's Online Blog" });
});*/

module.exports = helpRouter;
