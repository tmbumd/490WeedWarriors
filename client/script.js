const catalogFetch = await fetch('/api/catalog');
const catalog = await catalogFetch.json();
const plantData = []
const severityFetch = await fetch('/api/severity');
const severity = await severityFetch.json();
const severityData = []

// create lists of values for dropdowns
catalog.data.forEach(plant => {
    plantData.push({
        "name": `${plant.common_name} [<em>${plant.latin_name}</em>]`,
        "value": `${plant.symbol},${plant.catalog_id}`
    })
});

severity.data.forEach(level => {
    severityData.push({
        "name": level.category,
        "value": level.severity_id
    })
});

// instantiate dropdowns
$('.ui.severity')
    .dropdown(
        {
            fullTextSearch: true,
            placeholder: 'Choose severity',
            values: severityData
        });

$('.ui.plantType')
    .dropdown(
        {
            fullTextSearch: true,
            placeholder: 'Search plant',
            values: plantData
        });

// define form fields
$('.ui.form')
    .form({
        fields: {
            firstName: 'empty',
            lastName: 'empty',
            email: 'empty',
            position: 'empty',
            plant: 'empty',
            severityLevel: 'empty',
            file: 'empty',
            description: 'empty',
        }
    });

// get user coordinates for demo
const coordinates = document.querySelector('#coordinates')
navigator.geolocation.getCurrentPosition(function (position) {
    coordinates.value = `[${position.coords.latitude}, ${position.coords.longitude}]`
})

// listen for plant selection to show link
const plantSelector = document.querySelector('#plant')
plantSelector.addEventListener('change', () => {
    const link = `https://plants.usda.gov/home/plantProfile?symbol=${plantSelector.value.split(',')[0]}`
    document.querySelector('#usdaLink').innerHTML = `<a href="${link}" target="_blank">${link}</a>`
})

// handle form submission
document.querySelector('#submitBtn').addEventListener('click', async (submitEvent) => {
    submitEvent.preventDefault(); // prevent page from refreshing
    const userInput = $('.form').form('get values') // get form values
    console.log(userInput);

    // get media id for post request
    const query = `SELECT * FROM media WHERE media_id=(SELECT max(media_id) FROM media)`
    const mediaFetch = await fetch(`/api/custom/${query}`);
    const lastMediaID = await mediaFetch.json();

    // get person id for post request
    // TBD

    // get location id for post request
    // TBD

    // console.log(new Date().toISOString().slice(0, 19).replace('T', ' '))
    
    // post new report
    await fetch('/api/reports', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
            catalog_id: userInput.plant.split(',')[1],
            // location_id: ,
            severity_id: userInput.severityLevel,
            media_id: lastMediaID + 1,
            // person_id: ,
        })
    });
});
