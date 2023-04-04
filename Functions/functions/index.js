const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {ref, get} = require("firebase/database");

admin.initializeApp();
const firebase = admin.database();
const firestore = admin.firestore();

exports.scheduledFunction = functions.region("europe-west1")
    .runWith({maxInstances: 10})
    .pubsub
    .schedule("every 30 minutes")
    .onRun((context) => {
      get(ref(firebase, "machines")).then((snapshot) => {
        const machines = snapshot.val();
        const batch = firestore.batch();
        for (const [key, value] of Object.entries(machines)) {
          const machineRef = firestore.collection("machines")
              .doc(key)
              .collection("history")
              .doc(new Date().toISOString());
          batch.set(machineRef, value);
        }
        batch.commit();
      });
      return null;
    });
