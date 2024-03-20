const express = require("express");
const app = express();

app.get("/", (req, res) => {
    express.send("Ola, mundo!");
});
app.get("/usuarios/:id", (req, res) => {
    res.send("Detalhes do usuario com ID " + req.params.id);
});

const PORT = process.env. PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});