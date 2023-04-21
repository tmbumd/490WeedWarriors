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

async function getMediaURL() {
    let postid = uuidv4();
    let file = document.getElementById("hidden-new-file").files[0];
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

async function getMediaID() {
    const query = `SELECT media_id FROM media WHERE media_id=(SELECT max(media_id) FROM media)`;
    const mediaFetch = await fetch(`/api/custom/${query}`);
    const media = await mediaFetch.json()
    return media[0].length > 0 ? (media[0].media_id + 1) : 1;
}

async function getUserID() {
    const query = `SELECT user_id FROM users WHERE email = '${userInput.email}'`;
    const userFetch = await fetch(`/api/custom/${query}`);
    const user = await userFetch.json();
    let userID = user[0].length > 0 ? (user[0].user_id + 1) : -1;
}

function addListeners() {    // listen for plant selection to show link
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
}

async function addUser() {
    await fetch("/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            first_name: userInput.first_name,
            last_name: userInput.last_name,
            email: userInput.email
        })
    });
}

async function addMedia(mediaID, mediaURL) {
    await fetch("/api/media", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            media_id: mediaID,
            url: mediaURL
        })
    });
}

async function addReport(mediaID, userID, userInput) {
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
            media_id: mediaID,
            user_id: userID,
            comments: userInput.comments,
        }),
    }).then((res) => res.text());
}

function preserveInput(userInput) {
    // preserve user info for another submission
    form.form("set values", {
        firstName: userInput.firstName,
        lastName: userInput.lastName,
        email: userInput.email,
    });
    document.querySelectorAll(".saveInput").forEach((field) => {
        field.style.opacity = 0.6;
    });
}

async function addFormHandler() {
    document.querySelector(".form").addEventListener("submit", async function (event) {
        event.preventDefault();
        if (form.form("is valid")) {
            document.querySelector("#submitBtn").classList.add("disabled");
            const userInput = $(".form").form("get values"); // get form values

            const mediaID = getMediaID() // get media id for post request
            const mediaURL = await getMediaURL(); // get google cloud url
            console.log(mediaURL);
            // addMedia(mediaID, mediaURL) // insert new media record

            // let userID = getUserID()
            // if (userID == -1) { // create user if doesn't exist
            //     addUser()
            //     userID = getUserID()
            // }

            addReport(mediaID, 1, userInput) // change to userID later
            resetForm();
            document.querySelector("#successMessage").style.display = "block";
            preserveInput(userInput)
        }
    });
}
document.addEventListener('DOMContentLoaded', async () => {
    await initializeForm();
    document.querySelector('.form').classList.remove('loading');
    setUserCoordinates(); // get user coordinates for demo
    addListeners()
    addFormHandler()

});
