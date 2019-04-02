require('dotenv');
const router = require('express').Router();
const voiceModel = require('./voiceModel');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const urlencoded = require('body-parser').urlencoded;
const defaultIdentity = 'alice';
const AccessToken = require('twilio').jwt.AccessToken;
const ClientCapability = require('twilio').jwt.ClientCapability;
const VoiceGrant = AccessToken.VoiceGrant;

router.use(urlencoded({ extended: false }));

router.get('/accessToken', (request, response) => {
  const accountSid = process.env.ACCOUNT_SID;
  const authToken = process.env.AUTH_TOKEN;
  const appSid = process.env.APP_SID;

  const capability = new ClientCapability({
    accountSid: accountSid,
    authToken: authToken,
  });
  capability.addScope(
    new ClientCapability.OutgoingClientScope({ applicationSid: appSid})
  );
  capability.addScope(new ClientCapability.IncomingClientScope('joey'));
  const token = capability.toJwt();

  res.set('Content-Type', 'application/jwt')
  res.send(token);
});

module.exports = router;