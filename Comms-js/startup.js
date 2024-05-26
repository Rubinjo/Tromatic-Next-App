import { Service } from "node-windows";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create service objects
const senderSvc = new Service({
    name: "Tromatic Next Sender",
    description:
        "Sends Tromatic data to server for functioning Tromatic Next app.",
    script: path.join(__dirname, "sender.js"),
    grow: 1,
    maxRetries: 100,
    maxRestarts: 5,
});

const receiverSvc = new Service({
    name: "Tromatic Next Receiver",
    description: "Receives Tromatic Next app requests from the server.",
    script: path.join(__dirname, "receiver.js"),
    grow: 1,
    maxRetries: 100,
    maxRestarts: 5,
});

const gathererSvc = new Service({
    name: "Tromatic Next Gatherer",
    description: "Gathers drying programs.",
    script: path.join(__dirname, "gatherer.js"),
    grow: 1,
    maxRetries: 100,
    maxRestarts: 5,
});

// Start services after install
senderSvc.on("install", function () {
    senderSvc.start();
});

receiverSvc.on("install", function () {
    receiverSvc.start();
});

gathererSvc.on("install", function () {
    gathererSvc.start();
});

senderSvc.install();
receiverSvc.install();
gathererSvc.install();
