const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://rodrigomynds:SYpDUWyWiHC7JXQ7@clusterappesp.wxipx9p.mongodb.net/?retryWrites=true&w=majority&appName=ClusterAppESP', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB:'));
db.once('open', function() {
  console.log('Conectado ao MongoDB');
});

const CarCrashSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  distance_cm: Number
});

const CarCrash = mongoose.model('CarCrash', CarCrashSchema);

app.post('/crash', async (req, res) => {
  try {
    if (!req.body.distance_cm) {
      console.error('Dados de distância não fornecidos.');
      return res.status(400).send('Dados de distância não fornecidos.');
    }

    const distance_cm = req.body.distance_cm;
    const newCrash = new CarCrash({ distance_cm });

    await newCrash.save();
    console.log('Dados do acidente salvos no banco de dados.');

    res.sendStatus(200);
  } catch (error) {
    console.error('Erro ao salvar os dados do acidente no banco de dados:', error);
    res.sendStatus(500);
  }
});

app.get('/distance', async (req, res) => {
  try {
    const latestCrash = await CarCrash.findOne().sort({ date: -1 }).exec();
    if (!latestCrash) {
      res.sendStatus(404);
      return;
    }

    res.json({ distance_cm: latestCrash.distance_cm });
  } catch (error) {
    console.error('Erro ao consultar a distância no banco de dados:', error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});