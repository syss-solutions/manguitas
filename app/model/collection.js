// 20180828 - Collection Database Model
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CollectionSchema   = new Schema({
    name: String,
    editorial: String,      // Collection editorial.
    state: String,          // Opened or closed.
    size: String,           // Number of volumes.
    completed: Boolean      // Collection completed by the user.
});

module.exports = mongoose.model('Collection', CollectionSchema);