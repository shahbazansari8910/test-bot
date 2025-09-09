const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
let logs = [];
let botRunning = false;
let messageQueue = [];
let queueIndex = 0;

// === Load appstate.json ===
const APPSTATE_PATH = path.join(__dirname, "appstate.json");
let appstate = null;
if(fs.existsSync(APPSTATE_PATH)){
    try{
        appstate = fs.readJsonSync(APPSTATE_PATH);
        logs.push("✅ appstate.json loaded successfully");
    }catch(err){
        logs.push("❌ Failed to load appstate.json");
    }
}else{
    logs.push("⚠️ appstate.json not found");
}

// === Load messages.txt ===
const MESSAGES_PATH = path.join(__dirname, "messages.txt");
if(fs.existsSync(MESSAGES_PATH)){
    messageQueue = fs.readFileSync(MESSAGES_PATH, "utf-8")
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 0);
    logs.push(`📄 Loaded ${messageQueue.length} messages from messages.txt`);
}else{
    logs.push("⚠️ messages.txt not found");
}

// === Dummy PSID for testing ===
// Replace with actual PSID (Facebook user ID scoped to Page)
const TARGET_PSID = "YOUR_TARGET_PSID";

// --- Dashboard logs endpoint ---
app.get("/logs", (req, res) => {
    res.json(logs);
});

// --- Start Bot ---
app.post("/start", async (req, res) => {
    if(botRunning){
        return res.json({ status: "Bot already running" });
    }
    botRunning = true;
    logs.push("🚀 Bot started!");
    queueIndex = 0;
    sendNextMessage();
    res.json({ status: "Bot started" });
});

// --- Stop Bot ---
app.post("/stop", (req, res) => {
    botRunning = false;
    logs.push("⏹ Bot stopped!");
    res.json({ status: "Bot stopped" });
});

// --- Send next message from queue ---
async function sendNextMessage(){
    if(!botRunning) return;
    if(queueIndex >= messageQueue.length){
        logs.push("✅ All messages sent");
        botRunning = false;
        return;
    }

    const msg = messageQueue[queueIndex];
    logs.push(`👤 Sending: ${msg}`);

    try{
        // === REAL Messenger send logic using appstate.json/session ===
        // Demo purpose: Replace with actual FB send API / library that uses appstate
        // Here we simulate sending with a delay
        await new Promise(r=>setTimeout(r, 2000)); // 2 sec delay simulating send
        logs.push(`✅ Sent: ${msg}`);
    }catch(err){
        logs.push(`❌ Failed to send: ${msg}`);
        logs.push(err.toString());
    }

    queueIndex++;
    setTimeout(sendNextMessage, 1000); // wait 1 sec before next
}

app.listen(PORT, () => console.log(`🚀 Messenger Bot running on port ${PORT}`));
