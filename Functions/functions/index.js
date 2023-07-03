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

const errorDict = {
  en: {
    4: "Program ended",
    5: "Program stopped by error",
    12: "High temperature alarm",
    13: "Low temperature alarm",
    14: "High humidity alarm",
    15: "Low humidity alarm",
    16: "External alarm",
    17: "Temperature difference alarm",
    18: "Humidity difference alarm",
    24: "High temperature error",
    25: "Low humidity error",
    26: "Reference voltage error",
    27: "External error",
    28: "Temperature difference error",
    29: "Humidity difference error",
  },
  nl: {
    4: "Programma beëindigd",
    5: "Programma gestopt door een fout",
    12: "Hoge temperatuur alarm",
    13: "Lage temperatuur alarm",
    14: "Hoge luchtvochtigheid alarm",
    15: "Lage luchtvochtigheid alarm",
    16: "Extern alarm",
    17: "Temperatuurverschil alarm",
    18: "Luchtvochtigheidsverschil alarm",
    24: "Hoge temperatuur error",
    25: "Lage luchtvochtigheid error",
    26: "Referentiespanning error",
    27: "Externe error",
    28: "Temperatuurverschil error",
    29: "Humidity difference error",
  },
};

/**
 * Parse error as integer number to get the corresponding error numbers that need to be send to the user
 * @param {number} num is an integer reflecting the bit error
 * @return {object} array containing the errors found in num that need to be reported to the user
 */
function parseStatusNums(num) {
  const bitString = num.toString(2);
  const bitArray = bitString.split("").reverse();
  const statusNums = [];
  for (let i = 0; i < bitArray.length; i++) {
    if (parseInt(bitArray[i]) === 1) {
      statusNums.push(i);
    }
  }
  return statusNums.filter((item) =>
    [4, 5, 12, 13, 14, 15, 16, 17, 18, 24, 25, 26, 27, 28, 29].includes(
        item,
    ),
  );
}

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
      const statusNums = parseStatusNums(status);
      const mid = event.params.mid;
      for (const statusNum of statusNums) {
        get(child(ref(firebase), `machines/${mid}/CID`))
            .then((snapshot) => {
              if (snapshot.exists()) {
                const cid = snapshot.val();
                get(child(ref(firebase), `companies/${cid}/users`))
                    .then(async (snapshot) => {
                      if (snapshot.exists()) {
                        const users = snapshot.val();
                        const messages = [];
                        const userDeviceSnapshot = await get(
                            child(
                                ref(firebase),
                                `machines/${mid}/DeviceName`,
                            ),
                        );
                        if (userDeviceSnapshot.exists()) {
                          const deviceName =
                            userDeviceSnapshot.val();
                          for (const [uid, _] of Object.entries(
                              users,
                          )) {
                            try {
                              const userTokenSnapshot =
                                await get(
                                    child(
                                        ref(firebase),
                                        `users/${uid}/expoPushToken`,
                                    ),
                                );
                              if (
                                userTokenSnapshot.exists()
                              ) {
                                const expoPushToken =
                                    userTokenSnapshot.val();
                                if (
                                  Expo.isExpoPushToken(
                                      expoPushToken,
                                  )
                                ) {
                                  const userLanguageSnapshot =
                                    await get(
                                        child(
                                            ref(firebase),
                                            `users/${uid}/language`,
                                        ),
                                    );
                                  if (
                                    userLanguageSnapshot.exists()
                                  ) {
                                    const userLanguage = userLanguageSnapshot.val();
                                    messages.push({
                                      to: expoPushToken,
                                      sound: "default",
                                      title: "Error",
                                      body: `${errorDict[userLanguage][statusNum]} of ${deviceName}`,
                                    });
                                  } else {
                                    console.error(
                                        `No user language found for user ${uid}`,
                                    );
                                  }
                                } else {
                                  console.error(
                                      `Push token ${expoPushToken} is not a valid Expo push token`,
                                  );
                                }
                              } else {
                                console.log(
                                    "No Expo Push Token available",
                                );
                              }
                            } catch (error) {
                              console.error(error);
                            }
                          }
                        } else {
                          console.log("No device name found");
                        }
                        const chunks =
                            expo.chunkPushNotifications(messages);
                        const tickets = [];
                        (async () => {
                          for (const chunk of chunks) {
                            try {
                              const ticketChunk =
                                await expo.sendPushNotificationsAsync(
                                    chunk,
                                );
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
      }
    },
);
