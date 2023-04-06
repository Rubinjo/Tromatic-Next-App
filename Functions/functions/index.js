const functions = require("firebase-functions");
const admin = require("firebase-admin");
const {ref, get} = require("firebase/database");

admin.initializeApp();
const firebase = admin.database();
const firestore = admin.firestore();

exports.scheduledFbToFsFunction = functions.region("europe-west1")
    .runWith({maxInstances: 10})
    .pubsub
    .schedule("every 30 minutes")
    .onRun(async (context) => {
      const snapshot = await get(ref(firebase, "machines"));
      const machines = snapshot.val();
      const batch = firestore.batch();
      for (const [key, value] of Object.entries(machines)) {
        const machineRef = firestore.collection("machines")
            .doc(key)
            .collection("history")
            .doc(new Date().toISOString());
        batch.set(machineRef, value);
      }
      await batch.commit();
    });

exports.scheduledRemoveOldDataFsFunction = functions.region("europe-west1")
    .runWith({maxInstances: 10})
    .pubsub
    .schedule("every 30 minutes")
    .onRun(async (context) => {
      const now = new Date().getTime();
      const machineRef = firestore.collectionGroup("history");
      const snapshot = await machineRef.get();
      const batch = firestore.batch();
      snapshot.forEach((doc) => {
        const timeDP = new Date(doc.id).getTime();
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        const timeDiffInMs = now - timeDP;
        if (timeDiffInMs >= thirtyDaysInMs) {
          batch.delete(doc.ref);
        }
      });
      await batch.commit();
    });
