require('dotenv');
const router = require('express').Router();
const voiceModel = require('./voiceModel');
/* const {tokenGenerator} = require('./voiceHandler'); */

router.use(urlencoded({ extended: false }));

/* router.get('/accessToken', (request, response) => {
  response.send(tokenGenerator());
}); */

module.exports = router;