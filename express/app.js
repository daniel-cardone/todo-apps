const express = require("express");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"));

function readData() {
    if (!fs.existsSync("data.json")) {
        fs.writeFileSync("data.json", "{}");
    }

    return JSON.parse(fs.readFileSync("data.json", "utf-8"));
}

async function saveData(data) {
    fs.writeFile("data.json", JSON.stringify(data, null , 4), () => {});
}

const userData = readData();

app.get("/", (req, res) => {
    res.send("index.html");
});

app.get("/tasks", (req, res) => {
   const username = req.body.username;
   if (!username) {
       res.sendStatus(400);
       return;
   }

   res.send(userData);
});

app.post("/create", (req, res) => {
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}.`);
});
