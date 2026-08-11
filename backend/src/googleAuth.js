const { OAuth2Client } = require('google-auth-library');

function createGoogleCredentialVerifier(clientId = process.env.GOOGLE_CLIENT_ID) {
  const googleClient = clientId ? new OAuth2Client(clientId) : null;

  return async function verifyGoogleCredential(credential) {
    if (!credential) {
      throw new Error('Credential is required');
    }

    if (!googleClient) {
      throw new Error('Google client is not configured');
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: clientId
    });

    const payload = ticket.getPayload();
    if (!payload?.email) {
      throw new Error('Google did not return an email');
    }

    if (payload.email_verified !== true) {
      throw new Error('Google email is not verified');
    }

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name || payload.given_name || payload.email
    };
  };
}

const verifyGoogleCredential = createGoogleCredentialVerifier();

module.exports = { createGoogleCredentialVerifier, verifyGoogleCredential };
