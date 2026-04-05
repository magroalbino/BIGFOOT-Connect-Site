const admin = require('firebase-admin')

let db   = null
let auth = null

function initFirebase() {
  if (admin.apps.length > 0) {
    db   = admin.firestore()
    auth = admin.auth()
    return db
  }

  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    })

    db   = admin.firestore()
    auth = admin.auth()
    console.log('✅ Firebase conectado')
    return db
  } catch (err) {
    console.error('❌ Erro ao iniciar Firebase:', err.message)
    throw err
  }
}

function getDb() {
  if (!db) initFirebase()
  return db
}

function getAuth() {
  if (!auth) initFirebase()
  return auth
}

module.exports = { initFirebase, getDb, getAuth }
