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

const cors = require("cors");

app.use(cors({
  origin: "https://sistema-investimenti.vercel.app/"
}));

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://adminuser:testpass123@cluster0.0shdhtg.mongodb.net/banca-rp?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connessione a MongoDB Atlas riuscita'))
.catch(err => console.error('❌ Errore MongoDB:', err));

const Acquisto = mongoose.model('Acquisto', new mongoose.Schema({
  userId: String,
  prodotto: String,
  prezzo: Number,
  data: { type: Date, default: Date.now }
}));
const express = require('express');
const app = express();
app.use(express.json()); // Per leggere i JSON nelle richieste

app.post('/acquista', async (req, res) => {
  const { userId, prodotto, prezzo } = req.body;

  try {
    const nuovo = new Acquisto({ userId, prodotto, prezzo });
    await nuovo.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


app.get('/acquisti/:userId', async (req, res) => {
  try {
    const acquisti = await Acquisto.find({ userId: req.params.userId });
    res.json(acquisti);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

