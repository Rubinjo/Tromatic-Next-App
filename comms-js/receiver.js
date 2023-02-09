import * as dotenv from "dotenv"
import fs from "fs"
import { ref, onValue } from "firebase/database"

import setupFirebase from "./helper/auth.js"

dotenv.config()

/**
 * Machine ids to retrieve updates for.
 * @type {string[]}
 */
const MIDS = ["23rff3345GRR"];

const db = await setupFirebase({
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    databaseURL: process.env.DATABASEURL,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
}, process.env.EMAIL, process.env.PASSWORD);

for (const mid of MIDS) {
    console.log(mid)
    onValue(ref(db, "machines/" + mid), (snapshot) => {
        const machine = snapshot.val();
        const machineData = {
            DryChamberID: mid,
            DateTimeMessage: machine.DateTimeMessage,
            TempOffest: machine.TempOffest,
            EMCOffset: machine.EMCOffset,
            WMActive1: machine.WMActive1,
            WMActive2: machine.WMActive2,
            WMActive3: machine.WMActive3,
            WMActive4: machine.WMActive4,
            WMActive5: machine.WMActive5,
            WMActive6: machine.WMActive6,
            WMActive7: machine.WMActive7,
            WMActive8: machine.WMActive8,
            WMActive9: machine.WMActive9,
        }
        const jsonString = JSON.stringify(machineData)
        fs.writeFile("./folder/" + mid + ".json", jsonString, function (e) {
            if (e) {
                throw e
            } else {
                console.log(mid + ".json was added/updated")
            }
        })
    }, (e) => {
        console.error(e)
    })
}
