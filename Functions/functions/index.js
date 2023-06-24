const {setGlobalOptions} = require("firebase-functions/v2");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const {onValueUpdated} = require("firebase-functions/v2/database");

const admin = require("firebase-admin");
const {ref, get, child} = require("firebase/database");

const {Expo} = require("expo-server-sdk");
require("dotenv").config();

const expo = new Expo({accessToken: process.env.EXPO_ACCESS_TOKEN});

admin.initializeApp();
const firebase = admin.database();
const firestore = admin.firestore();

setGlobalOptions({region: "europe-west1", maxInstances: 10});

exports.scheduledFbToFsFunction = onSchedule(
    "every 30 minutes",
    async (event) => {
      const snapshot = await get(ref(firebase, "machines"));
      const machines = snapshot.val();
      const batch = firestore.batch();
      const dateIdString = new Date().toISOString();
      const dateExpiration = new Date();
      dateExpiration.setDate(dateExpiration.getDate() + 30);
      for (const [key, value] of Object.entries(machines)) {
        value["Expiration"] = dateExpiration;
        value["DateTimeMessage"] = new Date(value["DateTimeMessage"]);
        const machineRef = firestore
            .collection("machines")
            .doc(key)
            .collection("history")
            .doc(dateIdString);
        batch.set(machineRef, value);
      }
      await batch.commit();
    },
);

exports.statusChangedFunction = onValueUpdated(
    "/machines/{mid}/Status",
    (event) => {
      const status = event.data.after.val();
      const mid = event.params.mid;
      get(child(ref(firebase), `machines/${mid}/CID`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              const cid = snapshot.val();
              get(child(ref(firebase), `companies/${cid}/users`))
                  .then(async (snapshot) => {
                    if (snapshot.exists()) {
                      const users = snapshot.val();
                      const messages = [];
                      const userDeviceSnapshot = await get(child(ref(firebase), `machines/${mid}/DeviceName`));
                      if (userDeviceSnapshot.exists()) {
                        const deviceName = userDeviceSnapshot.val();
                        for (const [uid, _] of Object.entries(users)) {
                          try {
                            const userTokenSnapshot = await get(child(ref(firebase), `users/${uid}/expoPushToken`));
                            if (userTokenSnapshot.exists()) {
                              const expoPushToken = userTokenSnapshot.val();
                              if (Expo.isExpoPushToken(expoPushToken)) {
                                messages.push({
                                  to: expoPushToken,
                                  sound: "default",
                                  body: `Status ${status} of ${deviceName} changed.`,
                                  data: {withSome: "data"},
                                });
                              } else {
                                console.error(`Push token ${expoPushToken} is not a valid Expo push token`);
                              }
                            } else {
                              console.log("No Expo Push Token available");
                            }
                          } catch (error) {
                            console.error(error);
                          }
                        }
                      } else {
                        console.log("No device name found");
                      }
                      const chunks = expo.chunkPushNotifications(messages);
                      const tickets = [];
                      (async () => {
                        for (const chunk of chunks) {
                          try {
                            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                            tickets.push(...ticketChunk);
                          } catch (error) {
                            console.error(error);
                          }
                        }
                      })();
                    } else {
                      console.log("No data available");
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                  });
            } else {
              console.log("No data available");
            }
          })
          .catch((error) => {
            console.error(error);
          });
    },
);

// DEPRECATED, replaced by firebase TTL policy
// Not efficient at all, does lots of read requests
// exports.scheduledRemoveOldDataFsFunction = functions.region("europe-west1")
//     .runWith({maxInstances: 10})
//     .pubsub
//     .schedule("every 30 minutes")
//     .onRun(async (context) => {
//       const now = new Date().getTime();
//       const machineRef = firestore.collectionGroup("history");
//       const snapshot = await machineRef.get();
//       const batch = firestore.batch();
//       snapshot.forEach((doc) => {
//         const timeDP = new Date(doc.id).getTime();
//         const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
//         const timeDiffInMs = now - timeDP;
//         if (timeDiffInMs >= thirtyDaysInMs) {
//           batch.delete(doc.ref);
//         }
//       });
//       await batch.commit();
//     });
