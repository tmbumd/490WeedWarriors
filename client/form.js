async function initializeForm() {
    const catalogFetch = await fetch("/api/catalog");
    const catalog = await catalogFetch.json();
    const plantData = [];
    const severityFetch = await fetch("/api/severity");
    const severity = await severityFetch.json();
    const severityData = [];

    // create lists of values for dropdowns
    catalog.data.forEach((plant) => {
        plantData.push({
            name: `${plant.common_name} [<em>${plant.latin_name}</em>]`,
            value: `${plant.symbol},${plant.catalog_id},${plant.latin_name}`,
        });
    });

    severity.data.forEach((level) => {
        severityData.push({
            name: level.category,
            value: level.severity_id,
        });
    });

    // instantiate dropdowns
    $(".ui.severity").dropdown({
        fullTextSearch: true,
        placeholder: "Choose severity",
        values: severityData,
    });

    $(".ui.plantType").dropdown({
        fullTextSearch: true,
        placeholder: "Search plant",
        values: plantData,
    });

    // define form fields
    $(".ui.form").form({
        fields: {
            firstName: "empty",
            lastName: "empty",
            email: 'email',
            position: "empty",
            plant: "empty",
            severityLevel: "empty",
            file: "empty",
            comments: "minLength[0]",
        },
    });
}

// listen for plant selection to show link
const plantSelector = document.querySelector("#plant");
const usdaLink = document.querySelector("#usdaLink")
plantSelector.addEventListener("change", () => {
    // const link = `https://plants.usda.gov/home/plantProfile?symbol=${plantSelector.value.split(",")[0]}`;
    const selectedPlant = plantSelector.value.split(",")[2]
    const link = `https://www.google.com/search?q=${selectedPlant}&tbm=isch`;
    usdaLink.innerHTML = `<a href="${link}" target="_blank">Google images for ${selectedPlant}</a>`;
    // console.log(plantSelector.value)
});

// listen for file upload to show path
const fileUploadPath = document.querySelector("#uploadedFilePath")
document.querySelector("#hidden-new-file").addEventListener("change", () => {
    fileUploadPath.innerHTML = $(".form")
        .form("get value", "file")
        .replace("C:\\fakepath\\", "");
});

export { initializeForm };