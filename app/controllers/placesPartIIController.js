const places = [
  {
    id: 1,
    name: 'Parque da Cidade',
    latitude: -23.221112,
    longitude: -45.899678,
  },
  {
    id: 2,
    name: 'Praça Ulisses Guimarães',
    latitude: -23.180038,
    longitude: -45.884357,
  },
  {
    id: 3,
    name: 'Lagoa do Taquaral',
    latitude: -22.874863,
    longitude: -47.048815,
  },
  {
    id: 4,
    name: 'Jardim Botânico',
    latitude: -23.550520,
    longitude: -46.638340,
  },
  {
    id: 5,
    name: 'Praia de Copacabana',
    latitude: -22.971964,
    longitude: -43.182545,
  },
];

function getAllPlaces(req, res) {
  res.json(places);
}

function createPlace(req, res) {
  const { name, latitude, longitude } = req.body;
  const newPlace = {
    id: places.length + 1,
    name,
    latitude,
    longitude,
  };

  places.push(newPlace);
  res.status(201).json(newPlace);
}

function updatePlace(req, res) {
  const placeId = Number(req.params.id);
  const { name, latitude, longitude } = req.body;
  const placeIndex = places.findIndex(place => place.id === placeId);

  if (placeIndex !== -1) {
    places[placeIndex] = {
      id: placeId,
      name,
      latitude,
      longitude,
    };
    res.json(places[placeIndex]);
  } else {
    res.status(404).json({ message: 'Lugar não encontrado' });
  }
}
function deletePlace(req, res) {
  const placeId = Number(req.params.id);
  const placeIndex = places.findIndex(place => place.id === placeId);

  if (placeIndex !== -1) {
    places.splice(placeIndex, 1);
    res.json({ message: 'Lugar removido com sucesso!' });
  }
}

module.exports = {
  getAllPlaces,
  createPlace,
  updatePlace,
  deletePlace,
};
