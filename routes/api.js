var express = require('express');
var router = express.Router();

/* 
  20180822 - Test route to make sure everything is working 
  (accessed at GET http://localhost:3000/api)
*/
router.get('/', function(req, res) {
  res.json({ message: 'hooray! welcome to our api!' });   
});

// TODO - more routes for our API will happen here

module.exports = router;
