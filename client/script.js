const catalogFetch = await fetch('/api/catalog');
const catalog = await catalogFetch.json();
const plantData = []

// create list of plants for dropdown
catalog.data.forEach(plant => {
    plantData.push({
        "name": `${plant.common_name} [<em>${plant.latin_name}</em>]`,
        "value": plant.catalog_id
    })
});

// instantiate dropdowns
$('.ui.severity')
    .dropdown(
        {
            fullTextSearch: true,
            placeholder: 'Choose severity',
            values: [{
                "name": "Low",
                "value": 1
            }, {
                "name": "Medium",
                "value": 2
            }, {
                "name": "High",
                "value": 3
            },
            ]
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

// get user coordinates
const coordinates = document.querySelector('#coordinates')
navigator.geolocation.getCurrentPosition(function (position) {
    coordinates.value = `[${position.coords.latitude}, ${position.coords.longitude}]`
})

// handle form submission
document.querySelector('#submitBtn').addEventListener('click', async (submitEvent) => {
    submitEvent.preventDefault(); // prevent page from refreshing
    // get form values
    const userInput = $('.form').form('get values')
    console.log(userInput);
});
