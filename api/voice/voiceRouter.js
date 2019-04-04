const Router = require('express').Router;

const {tokenGenerator, voiceResponse, generateRTCToken} = require('./voiceHandler');

const router = new Router();

/**
 * Generate a Capability Token for a Twilio Client user - it generates a random
 * username for the client requesting a token.
 */
router.get('/token', (req, res) => {
  res.send(tokenGenerator(req));
});

router.get('/incoming', function(request, response) {
  response.send(incoming());
});

router.get('/ntstoken', (req, res) => {
  res.send(generateNTSToken());
});

router.post('/', (req, res) => {
  res.send(voiceResponse(req.body.To));
});

module.exports = router;