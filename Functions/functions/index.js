const {setGlobalOptions} = require("firebase-functions/v2");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const {
  onValueUpdated,
  onValueCreated,
} = require("firebase-functions/v2/database");
const {onCall, HttpsError} = require("firebase-functions/v2/https");

const {initializeApp} = require("firebase-admin/app");
const {getAuth} = require("firebase-admin/auth");
const {getDatabase} = require("firebase-admin/database");
const {getFirestore} = require("firebase-admin/firestore");
const {ref, get, child, set, remove, serverTimestamp} = require("firebase/database");

const {Expo} = require("expo-server-sdk");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config();

const expo = new Expo({accessToken: process.env.EXPO_ACCESS_TOKEN});
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

const app = initializeApp();
const firebase = getDatabase(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

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
  de: {
    4: "Programm beendet",
    5: "Programm wurde durch einen Fehler gestoppt",
    12: "Alarm bei hoher Temperatur",
    13: "Alarm bei niedriger Temperatur",
    14: "Alarm bei hoher Luftfeuchtigkeit",
    15: "Alarm bei niedriger Luftfeuchtigkeit",
    16: "Externer Alarm",
    17: "Temperaturdifferenzalarm",
    18: "Alarm bei Luftfeuchtigkeitsdifferenz",
    24: "Hoher Temperaturfehler",
    25: "Fehler bei niedriger Luftfeuchtigkeit",
    26: "Referenzspannungsfehler",
    27: "Externer Fehler",
    28: "Temperaturdifferenzfehler",
    29: "Fehler bei der Luftfeuchtigkeitsdifferenz",
  },
};

/**
 * Parse error as integer number to get the corresponding error numbers that need to be send to the user
 * @param {number} num reflecting the bit error
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

/**
 * Check if user has some type of privilege
 * @param {string} uid User identification number
 * @param {string} role Privilege type
 * @return {Promise<boolean>} Whether the user has the specified privilege.
 */
const checkPrivilege = async (uid, role) => {
  try {
    const snapshot = await get(ref(firebase, `${role}/${uid}`));
    return snapshot.exists();
  } catch (error) {
    throw new Error(`${role} privileges couldn't be confirmed`);
  }
};

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
                          const deviceName = userDeviceSnapshot.val();
                          for (const [uid, _] of Object.entries(
                              users,
                          )) {
                            try {
                              const userTokenSnapshot = await get(child(ref(firebase), `users/${uid}/expoPushToken`),
                              );
                              if (
                                userTokenSnapshot.exists()
                              ) {
                                const expoPushToken = userTokenSnapshot.val();
                                if (
                                  Expo.isExpoPushToken(
                                      expoPushToken,
                                  )
                                ) {
                                  const userLanguageSnapshot = await get(child(ref(firebase)`users/${uid}/language`));
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
      }
    },
);

const subjectDict = {
  en: {
    app: "Welcome to Tromatic NEXT",
    web: "New User Registration Notification",
  },
  nl: {
    app: "Welkom bij Tromatic NEXT",
    web: "Nieuwe gebruikersregistratie notificatie",
  },
  de: {
    app: "Willkommen bei Tromatic NEXT",
    web: "Benachrichtigung über die Registrierung eines neuen Benutzers",
  },
};

const welcomeDict = {
  en: "Welcome to",
  nl: "Welkom bij",
  de: "Willkommen bei",
};

const greetingDict = {
  en: "Hello",
  nl: "Hallo",
  de: "Hallo",
};

const resetDict = {
  en: "Password Reset",
  nl: "Wachtwoord reset",
  de: "Passwort zurücksetzen",
};

const resetlinkDict = {
  en: "You have requested a password reset for your account on the Tromatic NEXT platform. To set a new password, please follow the link to set your password:",
  nl: "U heeft een wachtwoord reset aangevraagd voor uw account op het Tromatic NEXT platform. Om een nieuw wachtwoord in te stellen, volgt u de link om uw wachtwoord in te stellen:",
  de: "Sie haben eine Passwortzurücksetzung für Ihr Konto auf der Tromatic NEXT-Plattform angefordert. Um ein neues Passwort festzulegen, folgen Sie bitte dem Link, um Ihr Passwort festzulegen:",
};

const linkDict = {
  en: "Welcome to Tromatic NEXT! We're excited to have you join our platform. To set up your account and create a password, please follow the link to set your password:",
  nl: "Welkom bij Tromatic NEXT! We zijn verheugd dat u zich bij ons platform heeft aangesloten. Om uw account in te stellen en een wachtwoord aan te maken, volgt u de link om uw wachtwoord in te stellen:",
  de: "Willkommen bei Tromatic NEXT! Wir freuen uns, dass Sie sich unserer Plattform angeschlossen haben. Um Ihr Konto einzurichten und ein Passwort zu erstellen, folgen Sie bitte dem Link, um Ihr Passwort einzurichten:",
};

const unwantedDict = {
  en: "If you did not request this e-mail, please ignore this e-mail.",
  nl: "Als u deze e-mail niet heeft aangevraagd, negeer dan deze e-mail.",
  de: "Wenn Sie diese E-Mail nicht angefordert haben, ignorieren Sie bitte diese E-Mail.",
};

const timeDict = {
  en: "The link provided in this e-mail will remain active and accessible for a period of three days from the date of this message.",
  nl: "De link die in deze e-mail wordt verstrekt, blijft actief en toegankelijk gedurende een periode van drie dagen vanaf de datum van dit bericht.",
  de: "Der in dieser E-Mail bereitgestellte Link bleibt ab dem Datum dieser Nachricht drei Tage lang aktiv und zugänglich.",
};

const thanksDict = {
  en: "Thank you for choosing Tromatic NEXT.",
  nl: "Bedankt dat u voor Tromatic NEXT heeft gekozen.",
  de: "Vielen Dank, dass Sie sich für Tromatic NEXT entschieden haben.",
};

const goodbyeDict = {
  en: "Best regards,",
  nl: "Met vriendelijke groet,",
  de: "Mit freundlichen Grüßen,",
};

const registerDict = {
  en: "We are pleased to inform you that a new user has registered with your company on the Tromatic NEXT platform. Below are the details of the new user:",
  nl: "We zijn verheugd u te kunnen meedelen dat er een nieuwe gebruiker is geregistreerd bij uw bedrijf op het Tromatic NEXT platform. Hieronder vindt u de gegevens van de nieuwe gebruiker:",
  de: "Wir freuen uns, Ihnen mitteilen zu können, dass sich ein neuer Benutzer auf der Tromatic NEXT-Plattform in Ihrem Unternehmen registriert hat. Nachfolgend finden Sie die Details des neuen Benutzers:",
};

const nameDict = {
  en: "Name",
  nl: "Naam",
  de: "Name",
};

const companyDict = {
  en: "Company",
  nl: "Bedrijf",
  de: "Unternehmen",
};

const optionsDict = {
  en: "You have the following options for managing this user's role:",
  nl: "U heeft de volgende opties voor het beheren van de rol van deze gebruiker:",
  de: "Sie haben die folgenden Optionen, um die Rolle dieses Benutzers zu verwalten:",
};

const adminDict = {
  en: "Add as Admin.",
  nl: "Toevoegen als Admin.",
  de: "Als Administrator hinzufügen.",
};

const editorDict = {
  en: "Add as Editor.",
  nl: "Toevoegen als Editor.",
  de: "Als Editor hinzufügen.",
};

const viewerDict = {
  en: "Add as Viewer.",
  nl: "Toevoegen als Viewer.",
  de: "Als Viewer hinzufügen.",
};

const deleteDict = {
  en: "Delete User.",
  nl: "Gebruiker verwijderen.",
  de: "Benutzer löschen.",
};

const newUserDict = {
  en: "New User on",
  nl: "Nieuwe gebruiker op",
  de: "Neuer Benutzer auf",
};

const buttonAccountDict = {
  en: "Set Password",
  nl: "Wachtwoord instellen",
  de: "Passwort festlegen",
};

const buttonResetDict = {
  en: "Reset Password",
  nl: "Wachtwoord resetten",
  de: "Passwort zurücksetzen",
};

const buttonMailDict = {
  en: "Verify E-mail",
  nl: "E-mail verifiëren",
  de: "E-Mail bestätigen",
};

const companyAdminDict = {
  en: "Company Admin",
  nl: "Bedrijfsbeheerder",
  de: "Unternehmensadministrator",
};

const addedDict = {
  en: "You have been added as a user to the Tromatic NEXT platform by your company administrator.",
  nl: "U bent door uw bedrijfsbeheerder toegevoegd als gebruiker aan het Tromatic NEXT platform.",
  de: "Sie wurden von Ihrem Unternehmensadministrator als Benutzer auf der Tromatic NEXT-Plattform hinzugefügt.",
};

const verifyDict = {
  en: "Please follow the link to verify your e-mail address.",
  nl: "Volg de link om uw e-mailadres te verifiëren.",
  de: "Bitte folgen Sie dem Link, um Ihre E-Mail-Adresse zu bestätigen.",
};

exports.onUserCreatedFunction = onValueCreated("users/{uid}", async (event) => {
  // Get user details
  const uid = event.params.uid;
  const userRecord = await auth.getUser(uid);
  const userRef = firestore.collection("users").doc(uid);

  // Generate a temporary key of 32 characters (256 bits)
  const tempTokenAccount = crypto.randomBytes(32).toString("hex");
  const dateExpiration = new Date();
  dateExpiration.setDate(dateExpiration.getDate() + 3);

  const cidSnapshot = await get(ref(firebase, `users/${uid}/cid`));
  const cid = cidSnapshot.val();

  const languageSnapshot = await get(ref(firebase, `companies/${cid}/language`));
  let language = "en";
  if (languageSnapshot.exists()) {
    language = languageSnapshot.val();
  }

  set(
      ref(
          firebase,
          `companies/${cid}/users/${uid}`,
      ),
      {added: serverTimestamp()},
  );

  // Check if user created via Web or App
  if (userRecord.metadata.lastSignInTime === null) {
    userRef.update(
        {passwordToken: tempTokenAccount, tokenExpiration: dateExpiration},
    );
    const accountInfo = await transporter.sendMail({
      from: `"Tromatic NEXT Team" <${process.env.SMTP_USERNAME}>`,
      to: `${userRecord.displayName}, ${userRecord.email}`,
      subject: subjectDict[language]["app"],
      text: `${greetingDict[language]} ${userRecord.displayName},

      ${linkDict[language]}

      https://tromatic.app/users/${userRecord.uid}/set-password/${tempTokenAccount}

      ${unwantedDict[language]}

      ${timeDict[language]}

      ${thanksDict[language]}

      ${goodbyeDict[language]}
      Tromatic NEXT Team
      `,
      html: `<!DOCTYPE html>
      <html>
      <head>
          <title>${welcomeDict[language]} Tromatic NEXT</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f7f7f7;
              }
              .header {
                  background-color: #0F7BCA;
                  color: #fff;
                  text-align: center;
                  padding: 10px;
              }
              .content {
                  background-color: #fff;
                  padding: 20px;
                  border-radius: 5px;
              }
              .button-container {
                  text-align: center;
              }
              .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #1AA3FF;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>${welcomeDict[language]} Tromatic NEXT</h1>
              </div>
              <div class="content">
                  <p>${greetingDict[language]} ${userRecord.displayName},</p>
                  <p>${linkDict[language]}</p>

                  <div class="button-container">
                      <a class="button" href="https://tromatic.app/users/${userRecord.uid}/set-password/${tempTokenAccount}">${buttonAccountDict[language]}</a>
                  </div>

                  <p>${unwantedDict[language]}</p>
                  <p>${timeDict[language]}</p>
                  <p>${thanksDict[language]}</p>
                  <p>${goodbyeDict[language]}<br>Tromatic NEXT Team</p>
              </div>
          </div>
      </body>
      </html>
      `,
    });
  } else {
    const tempTokenVerification = crypto.randomBytes(32).toString("hex");
    userRef.update(
        {verificationToken: tempTokenAccount, emailToken: tempTokenVerification, tokenExpiration: dateExpiration},
    );
    const usersSnapshot = await get(
        ref(firebase, `companies/${cid}/users`),
    );

    // Get user details
    const userDetails = [];
    const users = usersSnapshot.val();
    // loop through keys
    for (const userKey in users) {
      if (Object.prototype.hasOwnProperty.call(users, userKey)) {
        const adminSnapshot = await get(
            ref(firebase, `admin/${userKey}`),
        );
        const ownerSnapshot = await get(
            ref(firebase, `owner/${userKey}`),
        );
        if (adminSnapshot.exists() || ownerSnapshot.exists()) {
          const userSnapshot = await get(
              ref(firebase, `users/${userKey}`),
          );
          if (userSnapshot.exists()) {
            userDetails.push(userSnapshot.val());
          }
        }
      }
    }
    const accountInfo = await transporter.sendMail({
      from: `"Tromatic NEXT Team" <${process.env.SMTP_USERNAME}>`,
      to: Object.values(userDetails).map(
          (userDetail) => `"${userDetail.fullName}" <${userDetail.email}>`,
      ),
      subject: subjectDict[language]["web"],
      text: `${greetingDict[language]} ${companyAdminDict[language]},

      ${registerDict[language]}

      ${nameDict[language]}: ${userRecord.displayName}
      E-mail: ${userRecord.email}

      ${optionsDict[language]}

      1. ${adminDict[language]}
        https://tromatic.app/users/${userRecord.uid}/set-role/${tempTokenAccount}?role=admin&cid=${cid}

      2. ${editorDict[language]}
        https://tromatic.app/users/${userRecord.uid}/set-role/${tempTokenAccount}?role=editor&cid=${cid}

      3. ${viewerDict[language]}
        https://tromatic.app/users/${userRecord.uid}/set-role/${tempTokenAccount}?role=viewer&cid=${cid}

      4. ${deleteDict[language]}
        https://tromatic.app/users/${userRecord.uid}/set-role/${tempTokenAccount}?role=delete&cid=${cid}

      ${timeDict[language]}

      ${thanksDict[language]}

      ${goodbyeDict[language]}
      Tromatic NEXT Team
      `,
      html: `<!DOCTYPE html>
      <html>
      <head>
          <title>New User on Tromatic NEXT</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f7f7f7;
              }
              .header {
                  background-color: #0F7BCA;
                  color: #fff;
                  text-align: center;
                  padding: 10px;
              }
              .content {
                  background-color: #fff;
                  padding: 20px;
                  border-radius: 5px;
              }
              .button {
                  display: block;
                  padding: 10px 20px;
                  margin: 15px;
                  background-color: #1AA3FF;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>${newUserDict[language]} Tromatic NEXT</h1>
              </div>
              <div class="content">
                  <p>${greetingDict[language]} ${userRecord.displayName},</p>
                  <p>${registerDict[language]}</p>

                  <ul>
                      <li>${nameDict[language]}: ${userRecord.displayName}</li>
                      <li>E-mail: ${userRecord.email}</li>
                  </ul>

                  <p>${optionsDict[language]}</p>

                  <a class="button" href="https://tromatic.app/users/${userRecord.uid}/set-role/${tempTokenAccount}?role=admin&cid=${cid}">${adminDict[language]}</a>

                  <a class="button" href="https://tromatic.app/users/${userRecord.uid}/set-role/${tempTokenAccount}?role=editor&cid=${cid}">${editorDict[language]}</a>

                  <a class="button" href="https://tromatic.app/users/${userRecord.uid}/set-role/${tempTokenAccount}?role=viewer&cid=${cid}">${viewerDict[language]}</a>

                  <a class="button" href="https://tromatic.app/users/${userRecord.uid}/set-role/${tempTokenAccount}?role=delete&cid=${cid}">${deleteDict[language]}</a>

                  <p>${timeDict[language]}</p>
                  <p>${thanksDict[language]}</p>
                  <p>${goodbyeDict[language]}<br>Tromatic NEXT Team</p>
              </div>
          </div>
      </body>
      </html>

      `,
    });
    // Send verification e-mail to user
    const verificationInfo = await transporter.sendMail({
      from: `"Tromatic NEXT Team" <${process.env.SMTP_USERNAME}>`,
      to: `${userRecord.displayName}, ${userRecord.email}`,
      subject: subjectDict[language]["app"],
      text: `${greetingDict[language]} ${userRecord.displayName},

      ${addedDict[language]}

      ${nameDict[language]}: ${userRecord.displayName}
      ${companyDict[language]}: ${cid}

      ${verifyDict[language]}

      https://tromatic.app/users/${userRecord.uid}/set-email/${tempTokenVerification}

      ${unwantedDict[language]}

      ${timeDict[language]}

      ${thanksDict[language]}

      ${goodbyeDict[language]}
      Tromatic NEXT Team
      `,
      html: `<!DOCTYPE html>
      <html>
      <head>
          <title>${welcomeDict[language]} Tromatic NEXT</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f7f7f7;
              }
              .header {
                  background-color: #0F7BCA;
                  color: #fff;
                  text-align: center;
                  padding: 10px;
              }
              .content {
                  background-color: #fff;
                  padding: 20px;
                  border-radius: 5px;
              }
              .button-container {
                  text-align: center;
              }
              .button {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #1AA3FF;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>${welcomeDict[language]} Tromatic NEXT</h1>
              </div>
              <div class="content">
                  <p>${greetingDict[language]} ${userRecord.displayName},</p>
                  <p>${addedDict[language]}</p>

                  <ul>
                      <li>${nameDict[language]}: ${userRecord.displayName}</li>
                      <li>${companyDict[language]}: ${cid}</li>
                  </ul>

                  <p>${verifyDict[language]}</p>

                  <div class="button-container">
                      <a class="button" href="https://tromatic.app/users/${userRecord.uid}/set-email/${tempTokenVerification}">${buttonMailDict[language]}</a>
                  </div>

                  <p>${unwantedDict[language]}</p>
                  <p>${timeDict[language]}</p>
                  <p>${thanksDict[language]}</p>
                  <p>${goodbyeDict[language]}<br>Tromatic NEXT Team</p>
              </div>
          </div>
      </body>
      </html>
      `,
    });
  }
});

exports.sendResetPasswordEmailFunction = onCall(
    // {cors: ["tromatic.app"]},
    {cors: true},
    async (request) => {
      try {
        console.log(request.data.text.email);
        console.log("Look for user");
        const userRecord = await auth.getUserByEmail(request.data.text.email);
        if (userRecord) {
          console.log(userRecord);
          const languageSnapshot = await get(ref(firebase, `users/${userRecord.uid}/language`));
          let language = "en";
          if (languageSnapshot.exists()) {
            language = languageSnapshot.val();
          }
          const resetToken = crypto.randomBytes(32).toString("hex");
          const dateExpiration = new Date();
          dateExpiration.setDate(dateExpiration.getDate() + 3);
          console.log("Insert into firestore");
          await firestore
              .collection("users")
              .doc(userRecord.uid)
              .update({
                resetToken: resetToken,
                resetTokenExpiration: dateExpiration,
              });
          console.log("Send e-mail");
          const info = await transporter.sendMail({
            from: `"Tromatic NEXT Team" <${process.env.SMTP_USERNAME}>`,
            to: `${userRecord.displayName}, ${userRecord.email}`,
            subject: resetDict[language],
            text: `${greetingDict[language]} ${userRecord.displayName},

            ${resetlinkDict[language]}

            https://tromatic.app/users/${userRecord.uid}/reset-password/${resetToken}

            ${unwantedDict[language]}

            ${timeDict[language]}

            ${thanksDict[language]}

            ${goodbyeDict[language]}
            Tromatic NEXT Team
            `,
            html: `<!DOCTYPE html>
            <html>
            <head>
                <title>${welcomeDict[language]} Tromatic NEXT</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f7f7f7;
                    }
                    .header {
                        background-color: #0F7BCA;
                        color: #fff;
                        text-align: center;
                        padding: 10px;
                    }
                    .content {
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 5px;
                    }
                    .button-container {
                        text-align: center;
                    }
                    .button {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #1AA3FF;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>${welcomeDict[language]} Tromatic NEXT</h1>
                    </div>
                    <div class
                    ="content">
                        <p>${greetingDict[language]} ${userRecord.displayName},</p>
                        <p>${resetlinkDict[language]}</p>

                        <div class="button-container">
                            <a class="button" href="https://tromatic.app/users/${userRecord.uid}/reset-password/${resetToken}">${buttonResetDict[language]}</a>
                        </div>

                        <p>${unwantedDict[language]}</p>
                        <p>${timeDict[language]}</p>
                        <p>${thanksDict[language]}</p>
                        <p>${goodbyeDict[language]}<br>Tromatic NEXT Team</p>
                    </div>
                </div>
            </body>
            </html>
            `,
          });
          return {status: "success"};
        } else {
          throw new HttpsError(
              "not-found",
              "The user record could not be found",
          );
        }
      } catch (error) {
        console.log(error);
        throw new HttpsError(
            "not-found",
            "The user record could not be found",
        );
      }
    },
);

exports.resetPassword = onCall(
    // {cors: ["tromatic.app"]},
    {cors: true},
    async (request) => {
      try {
        const userRecord = await firestore
            .collection("users")
            .doc(request.data.text.uid)
            .get();
        if (userRecord.exists()) {
          const userData = userRecord.data();
          if (
            (userData.resetToken === request.data.text.resetToken) && (userData.resetTokenExpiration > new Date())
          ) {
            await auth.updateUser(request.data.text.uid, {
              password: request.data.text.password,
            });
            await firestore
                .collection("users")
                .doc(request.data.text.uid)
                .update({
                  resetToken: null,
                  resetTokenExpiration: null,
                });
            return {status: "success"};
          } else {
            throw new HttpsError(
                "invalid-argument",
                "The reset token is invalid",
            );
          }
        } else {
          throw new HttpsError(
              "not-found",
              "The user record could not be found",
          );
        }
      } catch (error) {
        console.log(error);
        throw new HttpsError(
            "not-found",
            "The user record could not be found",
        );
      }
    },
);

exports.setAuthUserPasswordFunction = onCall(
    // {cors: ["tromatic.app"]},
    {cors: true},
    async (request) => {
      try {
        const userRecord = await firestore
            .collection("users")
            .doc(request.data.text.uid)
            .get();
        if (userRecord.exists) {
          if (
            userRecord.data().passwordToken === request.data.text.passwordToken
          ) {
            await auth.updateUser(request.data.text.uid, {
              password: request.data.text.password,
              emailVerified: true,
            });
            await firestore
                .collection("users")
                .doc(request.data.text.uid)
                .update({
                  passwordToken: null,
                  accountTokenExpiration: null,
                });
            return {status: "success"};
          } else {
            throw new HttpsError(
                "invalid-argument",
                "The password token is invalid",
            );
          }
        } else {
          throw new HttpsError(
              "not-found",
              "The user record could not be found",
          );
        }
      } catch (error) {
        console.log(error);
        throw new HttpsError(
            "internal",
            "Something went wrong when processing your request",
        );
      }
    },
);

exports.setAuthUserRoleToken = onCall(
    // {cors: ["tromatic.app"]},
    {cors: true},
    async (request) => {
      try {
        const userRecord = await firestore
            .collection("users")
            .doc(request.data.text.uid)
            .get();
        if (userRecord.exists) {
          const userData = userRecord.data();
          if (
            userData.verificationToken === request.data.text.verificationToken
          ) {
            if (request.data.text.role === "delete") {
              firestore
                  .collection("users")
                  .doc(request.data.text.uid)
                  .delete();
              remove(ref(firebase, `users/${request.data.text.uid}`));
              remove(ref(firebase, `companies/${request.data.text.cid}/users/${request.data.text.uid}`));
              await auth.deleteUser(request.data.text.uid);
            } else {
              await firestore.collection("authorization").doc(request.data.text.uid).set(
                  {
                    isOwner: false,
                    isAdmin: request.data.text.role === "admin",
                    isEditor: request.data.text.role === "editor" || request.data.text.role === "admin",
                    isViewer: request.data.text.role === "viewer" || request.data.text.role === "editor" || request.data.text.role === "admin",
                  },
              );
              set(
                  ref(
                      firebase,
                      `${request.data.text.role === "admin" ? "admin" : (request.data.text.role === "editor" ? "editor" : "viewer")}/${request.data.text.uid}`,
                  ),
                  {assignedAt: serverTimestamp()},
              );
              if (userData.emailToken === null) {
                await firestore
                    .collection("users")
                    .doc(request.data.text.uid)
                    .update({
                      verificationToken: null,
                      tokenExpiration: null,
                    });
              } else {
                await firestore
                    .collection("users")
                    .doc(request.data.text.uid)
                    .update({
                      verificationToken: null,
                    });
              }
            }
            return {status: "success"};
          } else {
            throw new HttpsError(
                "invalid-argument",
                "The password token is invalid",
            );
          }
        } else {
          throw new HttpsError(
              "not-found",
              "The user record could not be found",
          );
        }
      } catch (error) {
        console.log(error);
        throw new HttpsError(
            "internal",
            "Something went wrong when processing your request",
        );
      }
    },
);

exports.setAuthVerified = onCall(
    // {cors: ["tromatic.app"]},
    {cors: true},
    async (request) => {
      try {
        const userRecord = await firestore
            .collection("users")
            .doc(request.data.text.uid)
            .get();
        if (userRecord.exists) {
          const userData = userRecord.data();
          if (
            userData.emailToken === request.data.text.emailToken
          ) {
            await auth.updateUser(request.data.text.uid, {
              emailVerified: true,
            });
            if (userData.passwordToken === null) {
              await firestore
                  .collection("users")
                  .doc(request.data.text.uid)
                  .update({
                    emailToken: null,
                    tokenExpiration: null,
                  });
            } else {
              await firestore
                  .collection("users")
                  .doc(request.data.text.uid)
                  .update({
                    emailToken: null,
                  });
            }

            return {status: "success"};
          } else {
            throw new HttpsError(
                "invalid-argument",
                "The email token is invalid",
            );
          }
        } else {
          throw new HttpsError(
              "not-found",
              "The user record could not be found",
          );
        }
      } catch (error) {
        console.log(error);
        throw new HttpsError(
            "internal",
            "Something went wrong when processing your request",
        );
      }
    },
);


exports.createAuthUserFunction = onCall(
    // {cors: ["tromatic.app"]},
    async (request) => {
      try {
        if (
          (await checkPrivilege(request.auth.uid, "admin")) || (await checkPrivilege(request.auth.uid, "owner"))
        ) {
          const userRecord = await auth.createUser({
            email: request.data.text.email,
            emailVerified: false,
            displayName: request.data.text.fullName,
            disabled: false,
          });
          return {uid: userRecord.uid};
        } else {
          throw new HttpsError(
              "permission-denied",
              "You do not have the required privileges",
          );
        }
      } catch (error) {
        console.log(error);
        throw new HttpsError(
            "internal",
            "Something went wrong when processing your request",
        );
      }
    },
);

exports.deleteAuthUserFunction = onCall(
    // {cors: ["tromatic.app"]},
    async (request) => {
      try {
        if (
          (await checkPrivilege(request.auth.uid, "admin")) || (await checkPrivilege(request.auth.uid, "owner"))
        ) {
          await auth.deleteUser(request.data.text.uid);
        } else {
          throw new HttpsError(
              "not-authorized",
              "You do not have the required privileges",
          );
        }
      } catch (error) {
        throw new HttpsError(
            "server-error",
            "Something went wrong when processing your request",
        );
      }
    },
);
