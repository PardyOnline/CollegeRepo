const express = require('express');



// const books = require('../models/book');

const bookRouter = express.Router();

bookRouter.use(express.json());

bookRouter.route('/')
.get((req,res,next) => {
    res.end('get') 
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


bookRouter.route('/create')
.get((req,res,next) => {
    res.render('newbook.ejs', { title: 'Books' });   
})

bookRouter.route('/create')
.post((req, res, next) => {
    console.log('creating')
    //res.end('Created')
    //res.end('Created book '+req.body.isbn)
    //res.sendFile('C:/Users/Me/Desktop/test.html')
    res.render('bookcreated',{bookdetails:req.body})
    //res.end('Created book '+req.body.isbn)
    
})

bookRouter.route('/create')
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /books/create');
})

bookRouter.route('/create')
.delete((req, res, next) => {
    res.statusCode = 403;
    res.end('Delete operation not  supported on /books/creste');
    
});


module.exports = bookRouter;