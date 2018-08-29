var express = require('express');
var router = express.Router();

// 20180829 - User Model.
var User     = require('../app/model/user');

// 20180829 - We've to define a middleware to use for all requests.
router.use(function(req, res, next) {
  // console.log('User API access...');
  next(); // Make sure we go to the next routes and don't stop here
});

/* 
  20180829 - Test route to make sure everything is working 
  (accessed at GET http://localhost:3000/api)

router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });   
});
*/

// 20180829 - User API Functions
router.route('/user')
    // get all users (accessed at GET http://localhost:3000/api/user)
    .get(function(req, res) {
      User.find(function(err, user) {
          if (err)
              res.send(err);
          res.json(user);
      });
    })
    // create a user (accessed at POST http://localhost:3000/api/user)
    .post(function(req, res) {
        var user = new User();      // create a new instance of the User model
        // 20180829 - User request updated
        user.email = req.body.email;  // set the user email (comes from the request)
        user.password = req.body.password;  // set the user password (comes from the request)

        // Save the user and check for errors
        user.save(function(err) {
            if (err)
                res.send(err);
            res.json({ message: 'User created!' });
        });
    });

// 20180829 - User API Functions, on routes that end in /user/:user_id
router.route('/user/:user_id')
    // Get the user with that id (accessed at GET http://localhost:3000/api/user/:user_id)
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })
    // Update the user with this id (accessed at PUT http://localhost:3000/api/user/:user_id)
    .put(function(req, res) {
        // use our user model to find the user we want
        User.findById(req.params.user_id, function(err, user) {
            if (err)
              res.send(err);

            // 20180829 - User request updated
            user.email = req.body.email;  // set the user email (comes from the request)
            user.password = req.body.password;  // set the user password (comes from the request)

            // Save the user
            user.save(function(err) {
              if (err)
                  res.send(err);
              res.json({ message: 'User updated!' });
            });
        });
    })
    // Delete the user with this id (accessed at DELETE http://localhost:3000/api/user/:user_id)
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });

module.exports = router;

