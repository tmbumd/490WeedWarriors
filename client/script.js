import { initializeForm } from "./initializeForm.js";

const form = $(".ui.form");
let latLong = "";

function setUserCoordinates() {
    const coordinates = document.querySelector("#coordinates");
    navigator.geolocation.getCurrentPosition(function (position) {
        latLong = `${position.coords.latitude}, ${position.coords.longitude}`;
        coordinates.value = `[${latLong}]`;
    });
}

function resetForm() {
    $(".ui.form").form("clear");
    document.querySelector("#uploadedFilePath").innerHTML = "";
    document.querySelector("#plantLink").innerHTML = "";
    setUserCoordinates();
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

async function getImageURL() {
    let postid = uuidv4();
    let inputElem = document.getElementById("hidden-new-file");
    let file = inputElem.files[0];
    let blob = file.slice(0, file.size, "image/jpeg");
    let formData = new FormData();
    formData.append(
        "hidden-new-file",
        new File([blob], `${postid}.jpeg`, { type: "image/jpeg" })
    );
    await fetch("/upload", {
        method: "POST",
        body: formData,
    }).then((res) => res.text());
    return `https://storage.googleapis.com/weedwarriors/${postid}.jpeg`;
}

document.addEventListener('DOMContentLoaded', async () => {
    await initializeForm();
    document.querySelector('.form').classList.remove('loading');
    setUserCoordinates(); // get user coordinates for demo

    // listen for plant selection to show link
    const plantSelector = document.querySelector("#plant");
    const plantLink = document.querySelector("#plantLink")
    plantSelector.addEventListener("change", () => {
        const selectedPlant = plantSelector.value.split(",")[3]
        const link = `https://www.google.com/search?q=${selectedPlant}&tbm=isch`;
        plantLink.innerHTML = `<a href="${link}" target="_blank">Google images for ${selectedPlant}</a>`;
    });

    // listen for file upload to show path
    const fileUploadPath = document.querySelector("#uploadedFilePath")
    document.querySelector("#hidden-new-file").addEventListener("change", () => {
        fileUploadPath.innerHTML = $(".form")
            .form("get value", "file")
            .replace("C:\\fakepath\\", "");
    });

    // handle form submission
    document
        .querySelector(".form")
        .addEventListener("submit", async function (event) {
            event.preventDefault();
            getImageURL()
            // post new report
            if (form.form("is valid")) {
                // check for valid inputs
                getImageURL()
                document.querySelector("#submitBtn").classList.add("disabled");
                const userInput = $(".form").form("get values"); // get form values
                // // get media id for post request
                // let query = `SELECT media_id FROM media WHERE media_id=(SELECT max(media_id) FROM media)`;
                // const mediaFetch = await fetch(`/api/custom/${query}`);
                // const mediaJSON = await mediaFetch.json()
                // const mediaID = mediaJSON[0].media_id + 1
                // console.log(mediaID)

                // get google cloud url
                const mediaURL = await getImageURL();
                console.log(mediaURL);

                // get person id for post request or insert new person record
                // check if user exists
                // query = `SELECT user_id FROM users WHERE email = '${userInput.email}'`;
                // const userFetch = await fetch(`/api/custom/${query}`);
                // const userResult = await mediaFetch.json();

                // insert new media record
                // TBD

                await fetch("/api/reports", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        timestamp: new Date().toISOString().slice(0, 19).replace("T", " "), // FIX TIMEZONE
                        catalog_id: userInput.plant.split(",")[1],
                        location: latLong,
                        severity_id: userInput.severityLevel,
                        // media_id: mediaID,
                        // user_id: userID,
                        comments: userInput.comments,
                    }),
                });

                resetForm();
                document.querySelector("#successMessage").style.display = "block";

                form.form("set values", {
                    firstName: userInput.firstName,
                    lastName: userInput.lastName,
                    email: userInput.email,
                });

                document.querySelectorAll(".saveInput").forEach((field) => {
                    field.style.opacity = 0.6;
                });
            }
        });
});
