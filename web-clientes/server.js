const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 8001;

// Disponibiliza os arquivos do frontend.
app.use(
    express.static(path.join(__dirname, "public"))
);

app.listen(PORT, () => {
    console.log(`Frontend: http://localhost:${PORT}`);
});