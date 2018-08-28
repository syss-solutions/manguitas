// 20180822 - Book Database Model
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BookSchema   = new Schema({
    // 20180828 - Book Database Model updated
    title: String,
    author: String,
    editorial: String,          // Book editorial.
    volume_number: String,      // Volume number (within a collection).
    id_collection: String       // Book collection (if apply).
});

module.exports = mongoose.model('Book', BookSchema);