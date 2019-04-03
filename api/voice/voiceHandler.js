require("dotenv");
const ClientCapability = require("twilio").jwt.ClientCapability;
const VoiceResponse = require("twilio").twiml.VoiceResponse;
const AccessToken = require("twilio").jwt.AccessToken;
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const VoiceGrant = AccessToken.VoiceGrant;
const appSid = process.env.APP_SID;
const pushCredSid = process.env.PUSH_CREDENTIAL_SID;
const outgoingApplicationSid = process.env.APP_SID;
const defaultIdentity = 'hohum';

exports.generateRTCToken = function generateRTCToken() {
  client.tokens
    .create()
    .then(token => console.log(token.username))
    .catch(err => console.log("RTC Token err:", err));
};

exports.tokenGenerator = function tokenGenerator() {
  function tokenGenerator(request, response) {
    // Parse the identity from the http request
    var identity = null;
    if (request.method == 'POST') {
      identity = request.body.identity;
    } else {
      identity = request.query.identity;
    }
  
    if(!identity) {
      identity = defaultIdentity;
    }
  
    // Used when generating any kind of tokens
    const accountSid = process.env.ACCOUNT_SID;
    const apiKey = process.env.API_KEY;
    const apiSecret = process.env.API_KEY_SECRET;
  
    // Used specifically for creating Voice tokens
    const pushCredSid = process.env.PUSH_CREDENTIAL_SID;
    const outgoingApplicationSid = process.env.APP_SID;
  
    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    const voiceGrant = new VoiceGrant({
        outgoingApplicationSid: outgoingApplicationSid,
        pushCredentialSid: pushCredSid
      });
  
    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    const token = new AccessToken(accountSid, apiKey, apiSecret);
    token.addGrant(voiceGrant);
    token.identity = identity;
    console.log('Token:' + token.toJwt());
    return response.send(token.toJwt());
  }
/*   const identity = "mee";
  const capability = new ClientCapability({
    accountSid: accountSid,
    authToken: authToken
  });
  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: outgoingApplicationSid,
    pushCredentialSid: pushCredSid
  });

  capability.addScope(new ClientCapability.IncomingClientScope(identity));
  capability.addScope(
    new ClientCapability.OutgoingClientScope({
      applicationSid: appSid,
      clientName: identity,
      grant: voiceGrant
    })
  );
  // Include identity and token in a JSON response
  return {
    identity: identity,
    token: capability.toJwt(),
  } */
};

exports.voiceResponse = function voiceResponse(toNumber) {
  // Create a TwiML voice response
  const twiml = new VoiceResponse();

  if (toNumber) {
    // Wrap the phone number or client name in the appropriate TwiML verb
    // if is a valid phone number
    const attr = isAValidPhoneNumber(toNumber) ? "number" : "client";

    const dial = twiml.dial({
      callerId: process.env.CALLER_ID
    });
    dial[attr]({}, toNumber);
  } else {
    twiml.say("Thanks for calling!");
  }

  return twiml.toString();
};

/**
 * Checks if the given value is valid as phone number
 * @param {Number|String} number
 * @return {Boolean}
 */
function isAValidPhoneNumber(number) {
  return /^[\d\+\-\(\) ]+$/.test(number);
}
