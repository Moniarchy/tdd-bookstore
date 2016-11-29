var express = require('express');
var router = express.Router();

router.get('/', (request, response, next) => {
response.render('index', { title: 'Express' });
});

router.get('/ping', (request, response, next) => {
  response.send('pong')
})

module.exports = router;
