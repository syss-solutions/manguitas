var express = require('express');
var router = express.Router();

// 20180822 - Book Model.
var Book     = require('../app/model/book');

// 20180822 - We've to define a middleware to use for all requests.
router.use(function(req, res, next) {
  // console.log('Book API access...');
  next(); // Make sure we go to the next routes and don't stop here
});

/* 
  20180822 - Test route to make sure everything is working 
  (accessed at GET http://localhost:3000/api)

router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });   
});
*/

// 20180822 - Book API Functions
router.route('/book')
    // get all the books (accessed at GET http://localhost:3000/api/book)
    .get(function(req, res) {
      Book.find(function(err, book) {
          if (err)
              res.send(err);
          res.json(book);
      });
    })
    // create a book (accessed at POST http://localhost:3000/api/book)
    .post(function(req, res) {
        var book = new Book();      // create a new instance of the Book model
        // 20180828 - Book request updated
        book.title = req.body.title;  // set the book title (comes from the request)
        book.author = req.body.author;  // set the book author (comes from the request)
        book.editorial = req.body.editorial;  // set the book editorial (comes from the request)
        book.volume_number = req.body.volume_number;  // set the book volume_number (comes from the request)
        book.id_collection = req.body.id_collection;  // set the book id_collection (comes from the request)

        // Save the book and check for errors
        book.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'Book created!' });
        });
    });

// 20180822 - Book API Functions, on routes that end in /book/:book_id
router.route('/book/:book_id')
    // Get the book with that id (accessed at GET http://localhost:3000/api/book/:book_id)
    .get(function(req, res) {
        Book.findById(req.params.book_id, function(err, book) {
            if (err)
                res.send(err);
            res.json(book);
        });
    })
    // Update the book with this id (accessed at PUT http://localhost:3000/api/book/:book_id)
    .put(function(req, res) {
        // use our book model to find the book we want
        Book.findById(req.params.book_id, function(err, book) {
            if (err)
              res.send(err);

            // 20180828 - Book request updated
            book.title = req.body.title;  // set the book title (comes from the request)
            book.author = req.body.author;  // set the book author (comes from the request)
            book.editorial = req.body.editorial;  // set the book editorial (comes from the request)
            book.volume_number = req.body.volume_number;  // set the book volume_number (comes from the request)
            book.id_collection = req.body.id_collection;  // set the book id_collection (comes from the request)

            // Save the book
            book.save(function(err) {
              if (err)
                  res.send(err);
              res.json({ message: 'Book updated!' });
            });
        });
    })
    // Delete the book with this id (accessed at DELETE http://localhost:3000/api/book/:book_id)
    .delete(function(req, res) {
        Book.remove({
            _id: req.params.book_id
        }, function(err, book) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });

module.exports = router;
