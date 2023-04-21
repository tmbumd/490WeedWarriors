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

export { initializeForm };