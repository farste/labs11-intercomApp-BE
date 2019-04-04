require("dotenv");
const ClientCapability = require("twilio").jwt.ClientCapability;
const Voiceres = require("twilio").twiml.Voiceres;
const AccessToken = require("twilio").jwt.AccessToken;
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const VoiceGrant = AccessToken.VoiceGrant;
const appSid = process.env.APP_SID;
const apiKey = process.env.API_KEY;
const apiKeySecret = process.env.API_KEY_SECRET;
const pushCredSid = process.env.PUSH_CREDENTIAL_SID;
const outgoingApplicationSid = process.env.APP_SID;

exports.generateNTSToken = function generateNTSToken() {
  client.tokens
    .create()
    .then(token => console.log(token.username))
    .catch(err => console.log("NTS Token err:", err));
};

exports.tokenGenerator = function tokenGenerator(req) {
  const defaultIdentity = Date.now();
  var identity = null;
  if (req.method == 'POST') {
    identity = req.body.identity;
  } else {
    identity = req.query.identity;
  
  }
  console.log(req.body);

  if(!identity) {
    identity = defaultIdentity;
}
  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: outgoingApplicationSid,
    pushCredentialSid: pushCredSid
  }); 

  const token = new AccessToken(accountSid, apiKey, apiKeySecret);
  token.addGrant(voiceGrant);
  // Include identity and token in a JSON res
  return {
    token: token.toJwt(),
    identity: identity,
  }
};

exports.incoming = function incoming() {
  const voiceres = new Voiceres();
  voiceres.say("Congratulations! You have received your first inbound call! Good bye.");
  console.log('res:' + voiceres.toString());
  return voiceres.toString();
}

exports.placeCall = async function placeCall(req, res) {
  // The recipient of the call, a phone number or a client
  var to = null;
  if (req.method == 'POST') {
    to = req.body.to;
  } else {
    to = req.query.to;
  }
  console.log(to);
  // The fully qualified URL that should be consulted by Twilio when the call connects.
  var url = req.protocol + '://' + req.get('host') + '/incoming';
  console.log(url);
  const accountSid = process.env.ACCOUNT_SID;
  const apiKey = process.env.API_KEY;
  const apiSecret = process.env.API_KEY_SECRET;
  const client = require('twilio')(apiKey, apiSecret, { accountSid: accountSid } );

  if (!to) {
    console.log("Calling default client:" + defaultIdentity);
    call = await client.api.calls.create({
      url: url,
      to: 'client:' + defaultIdentity,
      from: callerId,
    });
  } else if (isNumber(to)) {
    console.log("Calling number:" + to);
    call = await client.api.calls.create({
      url: url,
      to: to,
      from: callerNumber,
    });
  } else {
    console.log("Calling client:" + to);
    call =  await client.api.calls.create({
      url: url,
      to: 'client:' + to,
      from: callerId,
    });
  }
  console.log(call.sid)
  //call.then(console.log(call.sid));
  return res.send(call.sid);
}

exports.voiceres = function voiceres(toNumber) {
  // Create a TwiML voice res
  const twiml = new Voiceres();

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
