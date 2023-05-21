const express = require('express');
const app = express();
const routes = require('./config/routes');

app.use(express.json());

app.use('/v1', routes);

const port = 8083;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
