mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v11', // stylesheet location
    center: wandeling.geometry.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
    .setLngLat(wandeling.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h6>${wandeling.naam}</h6><p>${wandeling.plaats}</p>`
            )
    )
    .addTo(map);