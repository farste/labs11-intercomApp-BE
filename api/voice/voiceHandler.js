require('dotenv');
const ClientCapability = require('twilio').jwt.ClientCapability;
const VoiceResponse = require('twilio').twiml.VoiceResponse;


exports.tokenGenerator = function tokenGenerator() {
  const identity = 'mee';
  const accountSid = process.env.ACCOUNT_SID;
  const authToken = process.env.AUTH_TOKEN;
  const appSid = process.env.APP_SID;
  const capability = new ClientCapability({
    accountSid: accountSid,
    authToken: authToken,
  });

  capability.addScope(new ClientCapability.IncomingClientScope(identity));
  capability.addScope(new ClientCapability.OutgoingClientScope({
    applicationSid: appSid,
    clientName: identity,
  }));

  // Include identity and token in a JSON response
  return {
    identity: identity,
    token: capability.toJwt(),
  };
};

exports.voiceResponse = function voiceResponse(toNumber) {
  // Create a TwiML voice response
  const twiml = new VoiceResponse();

  if(toNumber) {
    // Wrap the phone number or client name in the appropriate TwiML verb
    // if is a valid phone number
    const attr = isAValidPhoneNumber(toNumber) ? 'number' : 'client';

    const dial = twiml.dial({
      callerId: config.callerId,
    });
    dial[attr]({}, toNumber);
  } else {
    twiml.say('Thanks for calling!');
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
