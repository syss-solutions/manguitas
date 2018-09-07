var express = require('express');
// 20180906 - Adding JWT authorization...
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config/config');
var router = express.Router();

// 20180829 - User Model.
var User     = require('../app/model/user');

// 20180906 - Verification token
var verifyToken = require('../config/auth/verifyToken');

// 20180829 - We've to define a middleware to use for all requests.
router.use(function(req, res, next) {
  console.info('User API access...');
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
    .get(verifyToken, function(req, res) {
      User.find(function(err, user) {
          if (err)
              res.send(err);
          res.json(user);
      });
    })
    // create a user (accessed at POST http://localhost:3000/api/user)
    // 20180906 - Authorization Token is not necessary to create a new user
    .post(function(req, res) {
        var user = new User();      // create a new instance of the User model
        // 20180906 - Encrypting password...
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        // 20180829 - User request updated
        user.email = req.body.email;  // set the user email (comes from the request)
        user.password = hashedPassword;  // set the user password (comes from the request)

        // Save the user and check for errors
        user.save(function(err) {
            if (err)
                res.send(err);
            // 20180906 - Creating a JWT token...
            var token = jwt.sign({ id: user.email }, config.SECRET, {
                expiresIn: config.EXPIRE_TIME
            });
            // res.json({ message: 'User created!'});
            res.json({ message: 'User created!', auth: true, token: token });
        });
    });

// 20180829 - User API Functions, on routes that end in /user/:user_id
router.route('/user/:user_id')
    // Get the user with that id (accessed at GET http://localhost:3000/api/user/:user_id)
    .get(verifyToken, function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    })
    // Update the user with this id (accessed at PUT http://localhost:3000/api/user/:user_id)
    .put(verifyToken, function(req, res) {
        // use our user model to find the user we want
        User.findById(req.params.user_id, function(err, user) {
            if (err)
              res.send(err);

            // 20180906 - Encrypting password...
            var hashedPassword = bcrypt.hashSync(req.body.password, 8);

            // 20180829 - User request updated
            user.email = req.body.email;  // set the user email (comes from the request)
            user.password = hashedPassword;  // set the user password (comes from the request)

            // Save the user
            user.save(function(err) {
                if (err)
                    res.send(err);
            
                // 20180906 - Creating a JWT token...
                var token = jwt.sign({ id: user.email }, config.SECRET, {
                    expiresIn: config.EXPIRE_TIME
                });
                res.json({ message: 'User updated!', auth: true, token: token });
                // res.json({ message: 'User updated!' });
            });
        });
    })
    // Delete the user with this id (accessed at DELETE http://localhost:3000/api/user/:user_id)
    .delete(verifyToken, function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });

module.exports = router;

