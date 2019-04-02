const ClientCapability = require('twilio').jwt.ClientCapability;
const VoiceResponse = require('twilio').twiml.VoiceResponse;

exports.tokenGenerator = function tokenGenerator() {
    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const appSid = process.env.APP_SID;
    const identity = 'test';
    const capability = new ClientCapability({
        accountSid: accountSid,
        authToken: authToken,
      });
      capability.addScope(
        new ClientCapability.OutgoingClientScope({ applicationSid: appSid})
      );
      capability.addScope(new ClientCapability.IncomingClientScope(identity));
      const token = capability.toJwt();
    
      return {
          identity: identity,
          token: capability.toJwt(),
      };
};