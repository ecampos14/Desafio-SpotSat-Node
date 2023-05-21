const express = require('express');
const app = express();
const routes = require('./config/routes');

app.use(express.json());

app.use('/v1', routes);

const v2Routes = require('./config/routes-v2');
app.use('/v2', v2Routes);

const placesRoutes = require('./config/placesRoutes');
app.use('/v3/places/', placesRoutes);

const port = 8083;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
