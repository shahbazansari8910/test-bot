const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs-extra");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
let logs = [];

// --- Load appstate.json ---
let appstate = null;
const APPSTATE_PATH = path.join(__dirname, "appstate.json");

if (fs.existsSync(APPSTATE_PATH)) {
    try {
        appstate = fs.readJsonSync(APPSTATE_PATH);
        logs.push("✅ appstate.json loaded successfully");
    } catch(err){
        logs.push("❌ Failed to load appstate.json");
    }
} else {
    logs.push("⚠️ appstate.json not found");
}

// --- Dashboard ---
app.get("/logs", (req, res) => {
    res.json(logs);
});

// --- Simulate Auto-reply (for demo purposes) ---
app.post("/send", (req, res) => {
    const { userMessage } = req.body;
    logs.push(`👤 User: ${userMessage}`);

    let reply = "🤖 Auto-reply: आपका संदेश मिल गया है!";
    logs.push(reply);

    res.json({ reply });
});

app.listen(PORT, () => console.log(`🚀 Messenger Bot running on port ${PORT}`));
