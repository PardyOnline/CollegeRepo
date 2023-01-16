const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var blogSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: false
    }
}, {
    timestamps: true
});
var blog = mongoose.model('Blog', blogSchema);

/*const docs = blogs.find();
console.log(docs);*/

module.exports = blog;