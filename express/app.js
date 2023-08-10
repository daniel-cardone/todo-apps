const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

function validateNewTaskData(body) {
    const { username, taskName, taskStatus, date } = body;
    if (!username || !taskName || !taskStatus || !date) return false;
    if (typeof username !== "string" || username.length > 12) return false;
    if (typeof taskName !== "string" || taskName.length > 100) return false;
    if (taskStatus !== "in progress" && taskStatus !== "complete") return false;
    if (typeof date !== "number" || date > Date.now()) return false;

    if (!userData[username]) {
        userData[username] = {};
    }

    return true;
}

function validateTaskUpdateData(body) {
    const { username, taskId } = body;

    return username && userData[username] && taskId && userData[username][taskId];
}

function readData() {
    if (!fs.existsSync("data.json")) {
        fs.writeFileSync("data.json", "{}");
    }

    return JSON.parse(fs.readFileSync("data.json", "utf-8"));
}

function saveData() {
    fs.writeFileSync("data.json", JSON.stringify(userData, null, 4));
}

function attemptSave() {
    try {
        saveData();
    } catch (err) {
        return false;
    }

    return true;
}

const userData = readData();

app.get("/", (req, res) => {
    res.send("index.html");
});

app.get("/tasks/:username", (req, res) => {
    const username = req.params.username;
    if (!username) {
        res.sendStatus(400);
        return;
    }

    res.send(userData[username] ?? {});
});

app.post("/create", (req, res) => {
    const { username, taskName, taskStatus, date } = req.body;
    if (!validateNewTaskData(req.body)) {
        res.sendStatus(400);
        return;
    }

    const newTaskId = uuidv4();
    userData[username][newTaskId] = { taskName, taskStatus, date };

    if (attemptSave()) {
        res.status(200).send(newTaskId);
    } else {
        res.sendStatus(500);
    }
});

app.post("/complete", (req, res) => {
    const { username, taskId } = req.body;
    if (!validateTaskUpdateData(req.body)) {
        res.sendStatus(400);
        return;
    }

    userData[username][taskId].taskStatus = "complete";

    if (attemptSave()) {
        res.sendStatus(200);
    } else {
        res.sendStatus(500);
    }
});

app.post("/reset", (req, res) => {
    const { username, taskId } = req.body;
    if (!validateTaskUpdateData(req.body)) {
        res.sendStatus(400);
        return;
    }

    userData[username][taskId].taskStatus = "in progress";

    if (attemptSave()) {
        res.sendStatus(200);
    } else {
        res.sendStatus(500);
    }
});

app.post("/delete", (req, res) => {
    const { username, taskId } = req.body;
    if (!validateTaskUpdateData(req.body)) {
        res.sendStatus(400);
        return;
    }

    delete userData[username][taskId];

    if (attemptSave()) {
        res.sendStatus(200);
    } else {
        res.sendStatus(500);
    }
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});
