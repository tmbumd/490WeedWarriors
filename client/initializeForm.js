async function initializeForm() {
    const catalogFetch = await fetch("/api/catalog");
    const catalog = await catalogFetch.json();
    const catalogData = [];
    const severityFetch = await fetch("/api/severity");
    const severity = await severityFetch.json();
    const severityData = [];

    // create lists of values for dropdowns
    catalog.data.forEach((plant) => {
        catalogData.push({
            name: `${plant.common_name} [<em>${plant.latin_name}</em>]`,
            value: `${plant.symbol},${plant.catalog_id},${plant.latin_name},${plant.common_name}`,
        });
    });

    severity.data.forEach((level) => {
        severityData.push({
            name: level.category,
            value: level.severity_id,
        });
    });

    // instantiate form elements
    $(".ui.severity").dropdown({
        fullTextSearch: true,
        placeholder: "Choose severity",
        values: severityData,
    });

    $(".ui.plantType").dropdown({
        fullTextSearch: true,
        placeholder: "Search plant",
        values: catalogData,
    });

    $('.ui.slider')
        .slider({
            min: 0,
            max: 10,
            start: 0,
            step: 1,
            smooth: true});

    // define form fields
    $(".ui.form").form({
        fields: {
            first_name: "empty",
            last_name: "empty",
            email: 'email',
            position: "empty",
            plant: "empty",
            severityLevel: "empty",
            file: "empty",
            comments: "minLength[0]", // make comments optional
        },
    });
}

export { initializeForm };