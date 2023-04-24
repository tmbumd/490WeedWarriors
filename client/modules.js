function setUserCoordinates(position) {
    document.querySelector("#position").value = `[${position.coords.latitude}, ${position.coords.longitude}]`;
}

function resetForm() {
    $(".ui.form").form("clear");
    document.querySelector("#uploadedFilePath").innerHTML = "";
    document.querySelector("#plantLink").innerHTML = "";
    document.querySelector("#successMessage").style.display = "none";
    document.querySelector("#submitBtn").classList.remove("disabled");
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );
}

function preserveInput(userInput) {
    if (!localStorage.getItem("email")) {
        localStorage.setItem("email", JSON.stringify(userInput.email));
    }
    if (!localStorage.getItem("first_name")) {
        localStorage.setItem("first_name", JSON.stringify(userInput.first_name));
    }
    if (!localStorage.getItem("last_name")) {
        localStorage.setItem("last_name", JSON.stringify(userInput.last_name));
    }
    restoreInput()
}

function restoreInput() {
    let email = JSON.parse(localStorage.getItem("email"));
    let first_name = JSON.parse(localStorage.getItem("first_name"));
    let last_name = JSON.parse(localStorage.getItem("last_name"));
    if (email && first_name && last_name) {
        $(".ui.form").form("set values", {
            first_name: first_name,
            last_name: last_name,
            email: email,
        });
        document.querySelectorAll(".saveInput").forEach((field) => {
            field.style.opacity = 0.6;
        });
    }
}

async function initializeForm() {
    // create lists of values for dropdowns
    let catalogData = JSON.parse(localStorage.getItem("catalogData"));
    if (!catalogData) {
        const catalogFetch = await fetch("/api/catalog");
        const catalog = await catalogFetch.json();
        catalogData = [];
        catalog.data.forEach((plant) => {
            catalogData.push({
                name: `${plant.common_name} [<em>${plant.latin_name}</em>]`,
                value: `${plant.catalog_id},${plant.latin_name},${plant.common_name}`,
            });
        });
        localStorage.setItem("catalogData", JSON.stringify(catalogData));
    }

    // restore user information if exists
    restoreInput()

    // instantiate form elements
    $(".ui.plant").dropdown({
        fullTextSearch: true,
        placeholder: "Search plant",
        values: catalogData,
    });

    let severityData = [];
    Array.from([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]).forEach((level) => {
        severityData.push({
            name: `${level}%`,
            value: level,
        });
    });

    $(".ui.severity").dropdown({
        placeholder: "Select severity level",
        values: severityData,
    });

    // define form fields
    $(".ui.form").form({
        fields: {
            first_name: "empty",
            last_name: "empty",
            email: "email",
            position: "empty",
            plant: "empty",
            severity: "empty",
            file: "empty",
            comments: "minLength[0]", // make comments optional
        },
    });

    // listen for plant selection to show link
    const plantSelector = document.querySelector("#plant");
    const plantLink = document.querySelector("#plantLink");
    plantSelector.addEventListener("change", () => {
        const selectedPlant = plantSelector.value.split(",")[2];
        const link = `https://www.google.com/search?q=${selectedPlant}&tbm=isch`;
        plantLink.innerHTML = `<a href="${link}" target="_blank">Google images for ${selectedPlant}</a>`;
    });

    // listen for file upload to show path
    const fileUploadPath = document.querySelector("#uploadedFilePath");
    document.querySelector("#hidden-new-file").addEventListener("change", () => {
        fileUploadPath.innerHTML = $(".form")
            .form("get value", "file")
            .replace("C:\\fakepath\\", "");
    });
}

export { setUserCoordinates, initializeForm, resetForm, uuidv4, preserveInput };
