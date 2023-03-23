import * as dotenv from "dotenv"
import fs from "fs"
import { ref, onValue, get } from "firebase/database"

import setupFirebase from "./helper/auth.js"

dotenv.config()

/**
 * Machine ids to retrieve updates for.
 * @type {string[]}
 */
const CID = "cid";

let mids

function sendData(mid, dateTime, lastEditor, changeItem, changeValue) {
    const machineData = {
        DryChamberID: mid,
        DateTimeMessage: dateTime.toISOString(),
        LastEditor: lastEditor,
    }
    machineData[changeItem] = changeValue
    const jsonString = JSON.stringify(machineData)
    fs.writeFile("../receiver/" + mid + "_" + dateTime.toJSON().slice(0, 19).replaceAll(":", "-") + ".json", jsonString, function (e) {
        if (e) {
            throw e
        } else {
            console.log(mid + ".json was added/updated")
        }
    })
}

const [db, auth] = await setupFirebase({
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    databaseURL: process.env.DATABASEURL,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
}, process.env.EMAIL, process.env.PASSWORD);

try {
    onValue(ref(db, "companies/" + CID + "/machines"), (snapshot) => {
        const machines = snapshot.val();
        mids = Object.keys(machines)
        for (const mid of mids) {

            for (const changeItem of ["TempOffest", "EMCOffset", "WMActive1", "WMActive2", "WMActive3", "WMActive4", "WMActive5", "WMActive6", "WMActive7", "WMActive8", "WMActive9"]) {
                onValue(ref(db, "machines/" + mid + "/" + changeItem), async (snapshot) => {
                    const changeValue = snapshot.val();
                    const lastEditor = (await get(ref(db, "machines/" + mid + "/LastEditor"))).val()
                    if (lastEditor.startsWith("u_")) {
                        sendData(mid, new Date(), lastEditor, changeItem, changeValue)
                    } else {
                        console.log("no user")
                    }
                })
            }

        }
    })

} catch (e) {
    console.error(e)
}
