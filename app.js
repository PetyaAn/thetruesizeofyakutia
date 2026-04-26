let currentRotation = 0;
function rotateYakutia(angle) {
  currentRotation += angle;

  currentGeoJson = rotateGeoJson(
    moveGeoJsonToCenter(originalGeoJson, originalCenter, currentCenter),
    currentCenter,
    currentRotation
  );

  drawYakutia(currentGeoJson);
}
function rotateGeoJson(geojson, center, angle) {
  const cloned = JSON.parse(JSON.stringify(geojson));

  function rotateCoord(coord) {
    const point = turf.point(coord);
    const pivot = turf.point(center);

    const distance = turf.distance(pivot, point, { units: 'kilometers' });
    const bearing = turf.bearing(pivot, point);

    const newPoint = turf.destination(
      pivot,
      distance,
      bearing + angle,
      { units: 'kilometers' }
    );

    return newPoint.geometry.coordinates;
  }

  function process(coords) {
    if (typeof coords[0] === 'number') {
      return rotateCoord(coords);
    }
    return coords.map(process);
  }

  cloned.features = cloned.features.map(f => {
    f.geometry.coordinates = process(f.geometry.coordinates);
    return f;
  });

  return cloned;
}
