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

// Verify Firebase ID token and return user data
const verifyFirebaseLogin = async (idToken) => {
  if (!idToken) {
    throw new Error("Firebase ID token is required");
  }

  const decodedToken = await auth.verifyIdToken(idToken);
  
  if (!decodedToken.email) {
    throw new Error("Firebase account does not include an email address");
  }

  return {
    firebaseUid: decodedToken.uid,
    email: decodedToken.email,
    name: decodedToken.name,
    picture: decodedToken.picture,
    provider: decodedToken.firebase?.sign_in_provider,
  };
};

module.exports = { admin, auth, verifyFirebaseLogin };
