const catalogFetch = await fetch('/api/catalog');
const catalog = await catalogFetch.json();
const plantData = []

console.log(catalog.data)

catalog.data.forEach(plant => {
    plantData.push({
        "name": `${plant.common_name} [${plant.latin_name}]`,
        "value": plant.catalog_id
    })
});

$('.ui.dropdown')
    .dropdown(
        {
            fullTextSearch: true,
            values: plantData
        });

const coordinates = document.querySelector('#coordinates')
navigator.geolocation.getCurrentPosition(function (position) {
    coordinates.value = `[${position.coords.latitude}, ${position.coords.longitude}]`
})

document.addEventListener('DOMContentLoaded', async () => {
    const submitBtn = document.querySelector('#submitBtn')

    submitBtn.addEventListener('click', async (submitEvent) => {
        submitEvent.preventDefault();
    });

});