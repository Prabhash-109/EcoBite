const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

// Firebase ID tokens must be verified with the Admin SDK on the backend.
// The client SDK is only for browser/mobile sign-in and cannot securely verify tokens.
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Export the Admin auth instance used by controllers to call verifyIdToken().
const auth = admin.auth();

module.exports = { admin, auth };
