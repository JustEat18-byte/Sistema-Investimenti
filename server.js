const express = require("express");
const app = express();
app.use(express.json());

let db = {}; // finto "database"

app.post("/investi", (req, res) => {
  const { userId, importo } = req.body;
  if (!db[userId]) db[userId] = { saldo: 1000, investimento: 0 };

  if (db[userId].saldo >= importo) {
    db[userId].saldo -= importo;
    db[userId].investimento += importo;
    return res.send("Investimento registrato");
  }

  res.status(400).send("Fondi insufficienti");
});

app.get("/saldo/:userId", (req, res) => {
  const user = db[req.params.userId] || { saldo: 1000, investimento: 0 };
  res.json(user);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server attivo sulla porta", PORT));

app.use(cors()); // Attenzione: non sicuro in produzione
