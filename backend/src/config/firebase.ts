import * as admin from 'firebase-admin'
import * as dotenv from 'dotenv'

dotenv.config()

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Handle newlines in the private key correctly and strip quotes if they exists
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n').replace(/^"|"$/g, '')
      }),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com` // Adjust if regional
    })
    console.log('Firebase Admin initialized successfully.')
  } catch (error) {
    console.error('Firebase Admin initialization error', error)
  }
}

export const db = admin.firestore()
export const rtdb = admin.database()
export const auth = admin.auth()
export { admin }
