var express = require('express');
var router = express.Router();

// 20180828 - Collection Model.
var Collection     = require('../app/model/collection');

// 20180828 - We've to define a middleware to use for all requests.
router.use(function(req, res, next) {
  // console.log('Book API access...');
  next(); // Make sure we go to the next routes and don't stop here
});

/* 
  20180828 - Test route to make sure everything is working 
  (accessed at GET http://localhost:3000/api)

router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });   
});
*/

// 20180828 - Collection API Functions
router.route('/collection')
    // get all the collections (accessed at GET http://localhost:3000/api/collection)
    .get(function(req, res) {
      Collection.find(function(err, collection) {
          if (err)
              res.send(err);
          res.json(collection);
      });
    })
    // create a collection (accessed at POST http://localhost:3000/api/collection)
    .post(function(req, res) {
        var collection = new Collection();      // create a new instance of the Collection model
        collection.name = req.body.name;  // set the collection name (comes from the request)
        collection.editorial = req.body.editorial;  // set the collection editorial (comes from the request)
        collection.state = req.body.state;  // set the collection state (comes from the request)
        collection.size = req.body.size;  // set the collection size (comes from the request)
        collection.completed = req.body.completed;  // set the collection completed (comes from the request)
        
        // Save the collection and check for errors
        collection.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Collection created!' });
        });
    });

// 20180828 - Collection API Functions, on routes that end in /collection/:collection_id
router.route('/collection/:collection_id')
    // Get the Collection with that id (accessed at GET http://localhost:3000/api/collection/:collection_id)
    .get(function(req, res) {
        Collection.findById(req.params.collection_id, function(err, collection) {
            if (err)
                res.send(err);
            res.json(collection);
        });
    })
    // Update the Collection with this id (accessed at PUT http://localhost:3000/api/collection/:collection_id)
    .put(function(req, res) {
        // use our book model to find the book we want
        Collection.findById(req.params.collection_id, function(err, collection) {
            if (err)
              res.send(err);

            // 20180828 - Collection request updated
            collection.name = req.body.name;  // set the collection name (comes from the request)
            collection.editorial = req.body.editorial;  // set the collection editorial (comes from the request)
            collection.state = req.body.state;  // set the collection state (comes from the request)
            collection.size = req.body.size;  // set the collection size (comes from the request)
            collection.completed = req.body.completed;  // set the collection completed (comes from the request)
        
            // Save the book
            collection.save(function(err) {
              if (err)
                  res.send(err);
              res.json({ message: 'Collection updated!' });
            });
        });
    })
    // Delete the Collection with this id (accessed at DELETE http://localhost:3000/api/collection/:collection_id)
    .delete(function(req, res) {
        Collection.remove({
            _id: req.params.collection_id
        }, function(err, collection) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });

module.exports = router;
