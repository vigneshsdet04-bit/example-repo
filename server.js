const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

let requestCount = 0;

app.use((req, res, next) => {
    requestCount++;
    console.log(`Request #${requestCount}: ${req.method} ${req.url}`);
    next();
});

app.get("/", (req, res) => {
    res.send("Hello from AWS!");
});

app.get("/health", (req, res) => {
    res.json({ status: "healthy" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
