import express from 'express';
import mongoose from 'mongoose';
import routes from "./Routes/index.js"
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from "path";
import cron from 'node-cron';

// Load environment variables from .env file
dotenv.config({ path: path.resolve('.env') });
let app = express();
app.use(cors());
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(routes);
let port = process.env.PORT || 5001;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

let mongoDb = process.env.MONGOURI;

mongoose.connect(mongoDb, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
let db = mongoose.connection;
db.on('error', (error) => {
  console.log(error);
  console.error.bind(console, 'connection error:');
});
db.on('connected', () => {
  console.log('Connected to the database.');
});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

// Cron job to keep the server from sleeping
cron.schedule('*/5 * * * *', () => {
  console.log('Keeping server alive: ' + new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }));
});

export { app };
