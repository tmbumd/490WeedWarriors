$('.ui.dropdown')
    .dropdown(
        {
            fullTextSearch: true,
            values: [{
                "name": "Maidenhair fern [Adiantum]",
                "value": "ADIAN"
            },
            {
                "name": "False foxglove [Agalinis]",
                "value": "AGALI"
            },
            {
                "name": "Ladyfern [Athyrium]",
                "value": "ATHYR"
            }]
        });

const coordinates = document.querySelector('#coordinates')
navigator.geolocation.getCurrentPosition(function (position) {
    coordinates.value = `[${position.coords.latitude}, ${position.coords.longitude}]`
})