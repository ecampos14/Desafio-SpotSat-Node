const express = require('express');
const app = express();
const routes = require('./config/routes');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'db_spotsat',
  password: 'ecampos',
  port: 5432
});

app.use(express.json());

app.use('/v1', routes);

const v2Routes = require('./config/routes-v2');
app.use('/v2', v2Routes);

const placesRoutes = require('./config/placesRoutes');
app.use('/v3/places/', placesRoutes);

const distanceRoutes = require('./config/distanceRoutes');
app.use('/v4/places/', distanceRoutes);

const geoPlaceRoutes = require('./config/GeoPlaceRoutes');
app.use('/v5', geoPlaceRoutes);

const port = 8083;
app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
