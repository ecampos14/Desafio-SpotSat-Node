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

function getPlaceById(req, res) {
  const { id } = req.params;
  const place = places.find((p) => p.id === parseInt(id));

  if (place) {
    res.json(place);
  } else {
    res.status(404).json({ message: 'Lugar não encontrado' });
  }
}

module.exports = {
  getAllPlaces,
  getPlaceById,
};
