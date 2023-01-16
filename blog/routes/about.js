var express = require('express');

const aboutRouter = express.Router();

aboutRouter.use(express.json());

aboutRouter.route('/')
.get((req,res,next) => {
    res.render('about.ejs', {title: 'About'});
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

/* GET home page. */
/*aboutRouter.get('/about', function(req, res, next) {
  res.render('about', { title: "Sean's Online Blog" });
});*/

module.exports = aboutRouter;
