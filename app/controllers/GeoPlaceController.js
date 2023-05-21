// geoPlaceController.js
const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db_spotsat',
    password: 'ecampos',
    port: 5432
});
// Listar lugares
const listPlaces = (req, res) => {
    pool.query('SELECT * FROM places', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

// Criar lugar
const createPlace = (req, res) => {
    const { name, point } = req.body;
    pool.query(
        'INSERT INTO places (name, point) VALUES ($1, ST_SetSRID(ST_GeomFromGeoJSON($2), 4326))',
        [name, JSON.stringify(point)],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(201).send('Lugar criado com sucesso');
        }
    );
};

// Obter lugar pelo ID
const getPlace = (req, res) => {
    const id = req.params.id;
    pool.query('SELECT * FROM places WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rows.length === 0) {
            res.status(404).send('Lugar não encontrado');
        } else {
            res.status(200).json(results.rows[0]);
        }
    });
};

// Atualizar lugar
const updatePlace = (req, res) => {
    const id = req.params.id;
    const { name, point } = req.body;
    pool.query(
        'UPDATE places SET name = $1, point = ST_SetSRID(ST_GeomFromGeoJSON($2), 4326) WHERE id = $3',
        [name, JSON.stringify(point), id],
        (error, results) => {
            if (error) {
                throw error;
            }
            if (results.rowCount === 0) {
                res.status(404).send('Lugar não encontrado');
            } else {
                res.status(200).send('Lugar atualizado com sucesso');
            }
        }
    );
};

// Remover lugar
const deletePlace = (req, res) => {
    const id = req.params.id;
    pool.query('DELETE FROM places WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rowCount === 0) {
            res.status(404).send('Lugar não encontrado');
        } else {
            res.status(200).send('Lugar removido com sucesso');
        }
    });
};

// Listar áreas
const listAreas = (req, res) => {
    pool.query('SELECT * FROM areas', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

// Criar área
const createArea = (req, res) => {
    const { name, polygon } = req.body;
    pool.query(
        'INSERT INTO areas (name, polygon) VALUES ($1, ST_SetSRID(ST_GeomFromGeoJSON($2), 4326))',
        [name, JSON.stringify(polygon)],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(201).send('Área criada com sucesso');
        }
    );
};

// Obter área pelo ID
const getArea = (req, res) => {
    const id = req.params.id;
    pool.query('SELECT * FROM areas WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rows.length === 0) {
            res.status(404).send('Área não encontrada');
        } else {
            res.status(200).json(results.rows[0]);
        }
    });
};

// Atualizar área
const updateArea = (req, res) => {
    const id = req.params.id;
    const { name, polygon } = req.body;
    pool.query(
        'UPDATE areas SET name = $1, polygon = ST_SetSRID(ST_GeomFromGeoJSON($2), 4326) WHERE id = $3',
        [name, JSON.stringify(polygon), id],
        (error, results) => {
            if (error) {
                throw error;
            }
            if (results.rowCount === 0) {
                res.status(404).send('Área não encontrada');
            } else {
                res.status(200).send('Área atualizada com sucesso');
            }
        }
    );
};

// Remover área
const deleteArea = (req, res) => {
    const id = req.params.id;
    pool.query('DELETE FROM areas WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rowCount === 0) {
            res.status(404).send('Área não encontrada');
        } else {
            res.status(200).send('Área removida com sucesso');
        }
    });
};

const findPlacesWithinCircle = (req, res) => {
    const { lat, lng, radius } = req.query;
    const point = {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
    };
    const geoJSONPoint = JSON.stringify(point);

    pool.query(
        `SELECT *, ST_AsGeoJSON(point) AS geojson
      FROM places
      WHERE ST_DWithin(point::geography, ST_SetSRID(ST_GeomFromGeoJSON($1), 4326)::geography, $2)`,
        [geoJSONPoint, radius],
        (error, results) => {
            if (error) {
                throw error;
            }
            const places = results.rows.map(row => ({
                ...row,
                point: JSON.parse(row.geojson)
            }));
            res.status(200).json(places);
        }
    );
};

const checkPlaceInArea = (req, res) => {
    const { placeId, areaId } = req.params;
    pool.query(
        `SELECT ST_Contains(area.polygon, place.point) AS is_within
      FROM areas area, places place
      WHERE area.id = $1 AND place.id = $2`,
        [areaId, placeId],
        (error, results) => {
            if (error) {
                throw error;
            }
            if (results.rows.length === 0) {
                res.status(404).send('Área ou lugar não encontrado');
            } else {
                res.status(200).json(results.rows[0]);
            }
        }
    );
};

const listPlacesInArea = (req, res) => {
    const areaId = req.params.areaId;
    pool.query(
        `SELECT *, ST_AsGeoJSON(point) AS geojson
      FROM places
      WHERE ST_Within(point, (SELECT polygon FROM areas WHERE id = $1))`,
        [areaId],
        (error, results) => {
            if (error) {
                throw error;
            }
            const places = results.rows.map(row => ({
                ...row,
                point: JSON.parse(row.geojson)
            }));
            res.status(200).json(places);
        }
    );
};

const calculateDistance = (req, res) => {
    const { placeId1, placeId2 } = req.query;
    pool.query(
        'SELECT ST_AsGeoJSON(ST_Distance(p1.point, p2.point)) AS distance FROM places p1, places p2 WHERE p1.id = $1 AND p2.id = $2',
        [placeId1, placeId2],
        (error, results) => {
            if (error) {
                throw error;
            }
            if (results.rows.length === 0) {
                res.status(404).send('Lugar(es) não encontrado(s)');
            } else {
                const distanceGeoJSON = results.rows[0].distance;
                res.status(200).json(JSON.parse(distanceGeoJSON));
            }
        }
    );
};
module.exports = {
    listPlaces,
    createPlace,
    getPlace,
    updatePlace,
    deletePlace,
    listAreas,
    createArea,
    getArea,
    updateArea,
    deleteArea,
    findPlacesWithinCircle,
    checkPlaceInArea,
    listPlacesInArea,
    calculateDistance
};