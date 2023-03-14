window.addEventListener('DOMContentLoaded', async () => {
    var map = L.map("map");
    map.locate({ setView: true, maxZoom: 16 });

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }
    ).addTo(map);

    // Create feature group for drawn items & layer group for previously drawn items
    var drawnItems = L.featureGroup().addTo(map);
    var existingData = L.layerGroup().addTo(map);

    // const response = await fetch('http://localhost:4000/api/records')
    // const data = await response.json()
    // getJSON(url + sqlQuery, function(data) {
    //     L.geoJSON(data, {onEachFeature: addPopup}).addTo(dbData);
    // });

    // L.geoJSON(data, {onEachFeature: addPopup}).addTo(dbData);

    const response = await fetch('http://localhost:4000/api/records')
    const data = await response.json()
    console.log(data)

    data.forEach(element => {
        const lat = element.geom.x
        const lon = element.geom.y
        let marker = new L.marker([lat, lon])
            .bindPopup(element.name)
        existingData.addLayer(marker)
    });

    var lc = L.control
        .locate({
            position: "topright",
            strings: {
                title: "Show me where I am, yo!"
            }
        })
        .addTo(map);

    // // Add draw control
    new L.Control.Draw({
        draw: {
            polygon: true,
            polyline: true,
            rectangle: false,     // Rectangles disabled
            circle: false,        // Circles disabled 
            circlemarker: false,  // Circle markers disabled
            marker: true
        },
        edit: {
            featureGroup: drawnItems
        }
    }).addTo(map);

    // // On draw - create editable popup
    map.on("draw:created", function (e) {
        e.layer.addTo(drawnItems);
        createFormPopup();
    });

    // map.on("draw:editstart", function (e) {
    //     drawnItems.closePopup();
    // });
    // map.on("draw:deletestart", function (e) {
    //     drawnItems.closePopup();
    // });
    // map.on("draw:editstop", function (e) {
    //     drawnItems.openPopup();
    // });
    // map.on("draw:deletestop", function (e) {
    //     if (drawnItems.getLayers().length > 0) {
    //         drawnItems.openPopup();
    //     }
    // });

    // // On submit
    // // $("body").on("click", "#submit", setData);

   



    // // Create editable popup
    function createFormPopup() {
        var popupContent =
            '<form>' +
            'Name:<br><input type="text" id="input_name"><br>' +
            '<input type="button" value="Submit" id="submit">' +
            '</form>';
        drawnItems.bindPopup(popupContent).openPopup();
        const submit = document.querySelector("#submit")
        if (submit !== undefined & submit !== null) {
            submit.addEventListener('click', () => { setData() })
        }
    }

    // // Submission - Sending to CARTO
    function setData() {

        // Get user name and description
        // var enteredName = $("#input_name").val();

        // For each drawn layer
        drawnItems.eachLayer(function (layer) {
            console.log('submitted')

            // Create SQL expression to insert layer
            // var drawing = JSON.stringify(layer.toGeoJSON().geometry);
            // var sql = 
            //     "INSERT INTO beer_sheva (the_geom, description, name) " + 
            //     "VALUES (ST_SetSRID(ST_GeomFromGeoJSON('" + 
            //     drawing + "'), 4326), '" + 
            //     enteredDescription + "', '" + 
            //     enteredUsername + "')";
            // console.log(sql);

            // // Send the data
            // $.post({
            //     url: "https://michaeldorman.carto.com/api/v2/sql",
            //     data: {"q": sql},
            //     dataType: "json",
            //     success: function() {
            //         console.log("Data saved");
            //     },
            //     error: function() {
            //         console.log("Problem saving the data");
            //     }
            // });

            // Transfer submitted drawing to the CARTO layer
            // var newData = layer.toGeoJSON();
            // newData.properties.description = enteredDescription;
            // newData.properties.name = enteredUsername;
            // L.geoJSON(newData, {onEachFeature: addPopup}).addTo(dbData);

        });

        // 	// Clear drawn items layer
        drawnItems.closePopup();
        drawnItems.clearLayers();

    }

});









