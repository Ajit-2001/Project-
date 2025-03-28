
mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: listing.geometry.coordinates,
        zoom: 8
    });


    console.log(listing.geometry.coordinates);
    // // Create a default Marker and add it to the map.
    const marker = new mapboxgl.Marker({color: 'red'})
        .setLngLat(listing.geometry.coordinates)//listing.geometry.coordinates
        .setPopup(
            new mapboxgl.Popup({ offset: 25 }) // Create popup
                .setHTML(
                    `<h3>${ listing.title }</h3> <p>Exact Location will be provided after booking</p>`

                ) // Add HTML content
        )

        .addTo(map);