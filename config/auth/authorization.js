// 20180906 - Adding JWT authorization...
var express = require('express');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

var router = express.Router();

var User     = require('../../app/model/user');

// 20180906 - Verification token
var verifyToken = require('./verifyToken');

// We've to define a middleware to use for all requests.
router.use(function(req, res, next) {
    console.info('User API access...');
    next(); // Make sure we go to the next routes and don't stop here
});

// Add the middleware function for user authentication
router.use(function (user, req, res, next) {
    res.status(200).send(user);
});

// Login (accessed at POST http://localhost:3000/api/auth/login)
router.route('/login')
    .post(function(req, res) {
        User.findOne({ email: req.body.email }, function (err, user) {
            if (err) 
                return res.status(500).send('Error on the server.');
            
            if (!user) 
                return res.status(404).send('No user found.');
        
            var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) 
                return res.status(401).send({ auth: false, token: null });
        
            var token = jwt.sign({ id: user.email }, config.SECRET, {
                expiresIn: config.EXPIRE_TIME
            });
            res.status(200).send({ auth: true, token: token });
        });
    });

// Logout (accessed at POST http://localhost:3000/api/logout)
router.route('/logout')
    .get(function(req, res) {
        res.status(200).send({ auth: false, token: null });
    });

// Do you have permission to be here?
/*
router.route('/me')
    .get(verifyToken, function(req, res, next) {
        User.findById(req.params.email, { password: 0 }, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!user) return res.status(404).send("No user found.");
            
            res.status(200).send(user);
        });
    });
*/

module.exports = router;