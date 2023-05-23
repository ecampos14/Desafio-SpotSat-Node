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
    pool.query('SELECT id, name, ST_AsGeoJSON(point) AS point FROM places', (error, results) => {
        if (error) {
            throw error;
        }
        const places = results.rows.map(row => ({
            id: row.id,
            name: row.name,
            point: JSON.parse(row.point)
        }));
        res.status(200).json(places);
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
    pool.query('SELECT id, name, ST_AsGeoJSON(point) AS point FROM places WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rows.length === 0) {
            res.status(404).send('Lugar não encontrado');
        } else {
            const place = {
                id: results.rows[0].id,
                name: results.rows[0].name,
                point: JSON.parse(results.rows[0].point)
            };
            res.status(200).json(place);
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
const listAreas = async (req, res) => {
    try {
        const query = 'SELECT id, name, ST_AsGeoJSON(polygon) AS geometry FROM areas';
        const { rows } = await pool.query(query);

        const features = rows.map(row => ({
            type: 'Feature',
            geometry: JSON.parse(row.geometry),
            properties: {
                id: row.id,
                name: row.name
            }
        }));

        const featureCollection = {
            type: 'FeatureCollection',
            features
        };

        res.status(200).json(featureCollection);
    } catch (error) {
        console.error('Erro ao listar áreas:', error);
        res.status(500).send('Erro ao listar áreas');
    }
};

// Criar área
const createArea = async (req, res) => {
    const { name, polygon } = req.body;
    try {
        const query = 'INSERT INTO areas (name, polygon) VALUES ($1, ST_SetSRID(ST_GeomFromGeoJSON($2), 4326)) RETURNING *';
        const { rows } = await pool.query(query, [name, JSON.stringify(polygon)]);
        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).send('Erro ao criar área');
    }
};

// Obter área pelo ID
const getArea = async (req, res) => {
    const id = req.params.id;
    try {
        const query = 'SELECT ST_AsGeoJSON(polygon)::json AS geometry, id, name FROM areas WHERE id = $1';
        const { rows } = await pool.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Área não encontrada' });
        }
        const { geometry, ...properties } = rows[0];
        const feature = { type: 'Feature', geometry: JSON.stringify(geometry), properties };
        res.json({ type: 'FeatureCollection', features: [feature] });
    } catch (error) {
        console.error('Erro ao obter área:', error);
        res.status(500).json({ error: 'Erro ao obter área' });
    }
};

// Atualizar área
const updateArea = async (req, res) => {
    const id = req.params.id;
    const { name, polygon } = req.body;
    try {
        const query = 'UPDATE areas SET name = $1, polygon = ST_SetSRID(ST_GeomFromGeoJSON($2), 4326) WHERE id = $3 RETURNING *';
        const { rowCount, rows } = await pool.query(query, [name, JSON.stringify(polygon), id]);
        if (rowCount === 0) {
            res.status(404).send('Área não encontrada');
        } else {
            res.status(200).json(rows[0]);
        }
    } catch (error) {
        res.status(500).send('Erro ao atualizar área');
    }
};

// Remover área
const deleteArea = async (req, res) => {
    const id = req.params.id;
    try {
        const query = 'DELETE FROM areas WHERE id = $1 RETURNING *';
        const { rowCount } = await pool.query(query, [id]);
        if (rowCount === 0) {
            res.status(404).send('Área não encontrada');
        } else {
            res.status(200).send('Área removida com sucesso');
        }
    } catch (error) {
        res.status(500).send('Erro ao remover área');
    }
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
        'SELECT ST_Distance(p1.point, p2.point) AS distance FROM places p1, places p2 WHERE p1.id = $1 AND p2.id = $2',
        [placeId1, placeId2],
        (error, results) => {
            if (error) {
                throw error;
            }
            if (results.rows.length === 0) {
                res.status(404).send('Lugar(es) não encontrado(s)');
            } else {
                const distance = results.rows[0].distance;
                res.status(200).json({ distance });
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