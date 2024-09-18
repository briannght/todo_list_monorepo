import express from 'express';
import * as path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Pool } from 'pg';
import { SQL } from './constants/sql';

const host = process.env.HOST ?? 'localhost' as const;
const port = process.env.PORT ? Number(process.env.PORT) : 3000 as const;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  database: process.env.POSTGRES_DATABASE,
});

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to server!' });
});

app.get('/duties', async (req, res) => {
  const result = await pool.query(SQL.getDuties);
  res.status(200).json(result.rows);
});

app.get('/duties/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(SQL.getDutyById, [id]);
  res.status(200).json(result.rows[0]);
});

app.post('/duties', async (req, res) => {
  const { title, description, assignee, creator, priority, status } = req.body;
  const result = await pool.query(SQL.createDuty, [title, description, assignee, creator, priority, status]);
  res.status(201).json(result.rows[0]);
});

app.put('/duties/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, assignee, creator, priority, status } = req.body;
  const result = await pool.query(SQL.updateDutyById, [title, description, assignee, creator, priority, status, id]);
  res.status(200).json(result.rows[0]);
});

app.delete('/duties/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query(SQL.deleteDutyById, [id]);
  res.status(204).send();
});

const server = app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

server.on('error', console.error);
