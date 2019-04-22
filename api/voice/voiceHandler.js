require("dotenv");
const ClientCapability = require("twilio").jwt.ClientCapability;
const VoiceResponse = require("twilio").twiml.VoiceResponse;
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
const callerNumber = process.env.CALLER_ID;
const urlencoded = require('body-parser').urlencoded;

/* exports.generateNTSToken = function generateNTSToken() {
  client.tokens
    .create()
    .then(token => console.log(token.username))
    .catch(err => console.log("NTS Token err:", err));
}; */

exports.tokenGenerator = function tokenGenerator(req) {
  const defaultIdentity = Date.now();
  var identity = null;
  if (req.method == 'POST') {
    identity = req.body.identity;
  } else {
    identity = req.query.identity;
  
  }
  

  if(!identity) {
    identity = defaultIdentity;
}
  const voiceGrant = new VoiceGrant({
    outgoingApplicationSid: outgoingApplicationSid,
    pushCredentialSid: pushCredSid
  }); 

  const token = new AccessToken(accountSid, apiKey, apiKeySecret);
  token.addGrant(voiceGrant);
  token.identity = identity;
  // Include identity and token in a JSON res
  return token.toJwt();
};

exports.makeCall = function makeCall(request, response) {
  // The recipient of the call, a phone number or a client
  var to = null;

  if (request.method == 'POST') {
    to = request.body.to;
    console.log('Post:', request.body)
  } else {
    to = request.query.to;
    console.log('Else:', request.query)
  }
  const voiceResponse = new VoiceResponse();

  if (!to) {
      voiceResponse.say("Congratulations! You have made your first call! Good bye.");
  } else if (isNumber(to)) {
      const dial = voiceResponse.dial({callerId : callerNumber});
      dial.conference({
        statusCallback: 'https://intercom-be-farste.herokuapp.com/api/voice/send-notification',
        statusCallbackEvent: 'start end join leave mute hold'
    }, to);
  } else {
      const dial = voiceResponse.dial({callerId : callerNumber});
      dial.conference({
        statusCallback: 'https://intercom-be-farste.herokuapp.com/api/voice/send-notification',
        statusCallbackEvent: 'start end join leave mute hold'
    }, to);
  }
  console.log('Response:' + voiceResponse.toString());
  return voiceResponse.toString();
}

/* exports.incoming = function incoming() {
  const voiceResponse = new VoiceResponse();
  voiceResponse.say("Congratulations! You have received your first inbound call! Good bye.");
  console.log('res:' + voiceResponse.toString());
  return voiceResponse.toString();
} */

/* exports.placeCall = async function placeCall(req, res) {
  // The recipient of the call, a phone number or a client
  var to = null;
    if (req.method == 'POST') {
    to = await req.body.to;
  } else {
    to = await req.query.to;
  }
  console.log(to);
  // The fully qualified URL that should be consulted by Twilio when the call connects.
  var url = req.protocol + '://' + req.get('host') + '/joinConference';
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
  return call.sid;
}*/

exports.voiceResponse = function voiceResponse(toNumber) {
  // Create a TwiML voice res
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

function isNumber(to) {
  if(to.length == 1) {
    if(!isNaN(to)) {
      console.log("It is a 1 digit long number" + to);
      return true;
    }
  } else if(String(to).charAt(0) == '+') {
    number = to.substring(1);
    if(!isNaN(number)) {
      console.log("It is a number " + to);
      return true;
    };
  } else {
    if(!isNaN(to)) {
      console.log("It is a number " + to);
      return true;
    }
  }
  console.log("not a number");
  return false;
}

/* exports.joinConference = function joinConference(request, response) {
  // Use the Twilio Node.js SDK to build an XML response
  const twiml = new VoiceResponse();

  // Start with a <Dial> verb
  const dial = twiml.dial();
    dial.conference(`${request.body.to}`);

  // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
}; */


exports.registerBinding = function registerBinding(req, res) {

  client.notify.services(process.env.SERVICE_SID)
  .bindings
  .create({
     identity: req.body.identity,
     address: req.body.Address,
     bindingType: 'apn',
     endpoint: 'endpoint_id'
   })
  .then(binding => console.log(binding))
  .catch(err => console.error(err))
/*   const twilioClient = context.getTwilioClient();
  const service = twilioClient.notify.services(
     context.TWILIO_NOTIFICATION_SERVICE_SID
 );

 const binding = {
     'identity':event.identity,
     'bindingType':event.BindingType,
     'address':event.Address
 }

 service.bindings.create(binding).then((binding) => {
     console.log(binding);
     // Send a JSON response indicating success
     callback(null, {message: 'Binding created!'});
 }).catch((error) => {
     console.log(error);
     callback(error, {
     error: error,
     message: 'Failed to create binding: ' + error,
   });
}); */
};

exports.sendNotification = function sendNotification(req, res) {

  // Create a reference to the user notification service
  console.log("body: id", req.body);
  client.notify.services(process.env.SERVICE_SID)
             .notifications
             .create({body: req.body.Reason, identity: req.body.FriendlyName})
             .then(notification => console.log(notification.sid))
             .catch(err => console.error(err));
 };

/**
 * Checks if the given value is valid as phone number
 * @param {Number|String} number
 * @return {Boolean}
 */
function isAValidPhoneNumber(number) {
  return /^[\d\+\-\(\) ]+$/.test(number);
}
