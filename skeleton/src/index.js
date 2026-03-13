const express = require('express');

const app = express();
const port = process.env.PORT || ${{ values.port }};

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  res.json({ message: 'Hello from ${{ values.name }}' });
});

app.listen(port, () => {
  console.log(`${{ values.name }} listening on port ${port}`);
});
