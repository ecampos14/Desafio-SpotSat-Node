const places = [
    {
      id: 1,
      name: 'Parque da Cidade',
      latitude: -23.221112,
      longitude: -23.221112,
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
  
  function calculateDistance(point1, point2) {
    const distance = Math.sqrt(
      Math.pow(point1.latitude - point2.latitude, 2) +
      Math.pow(point1.longitude - point2.longitude, 2)
    );
  
    return distance;
  }
  
  function getDistanceBetweenPlaces(req, res) {
    const { id1, id2 } = req.params;
  
    const place1 = places.find(place => place.id === Number(id1));
    const place2 = places.find(place => place.id === Number(id2));
  
    if (place1 && place2) {
      const distance = calculateDistance(place1, place2);
  
      res.json({ distance });
    } else {
      res.status(404).json({ message: 'Um ou ambos os lugares não foram encontrados' });
    }
  }
  
  function searchPlaces(req, res) {
    const { latitude, longitude, radius } = req.query;
  
    const centralPoint = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    };
  
    const searchRadius = parseInt(radius);
  
    const placesWithinRadius = places.map(place => {
      const distance = calculateDistance(centralPoint, place);
      return {
        ...place,
        distance
      };
    }).filter(place => place.distance <= searchRadius);
  
    res.json(placesWithinRadius);
  }
  
  module.exports = {
    getDistanceBetweenPlaces,
    searchPlaces
  };
  