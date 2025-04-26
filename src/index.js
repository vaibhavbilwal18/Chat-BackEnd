import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (_req, res) => {
  res.send('Backend is running!');
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
