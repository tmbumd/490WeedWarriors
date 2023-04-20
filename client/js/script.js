import { initializeForm } from "./form.js";

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
    document.querySelector("#usdaLink").innerHTML = "";
    setUserCoordinates();
    document.querySelector("#successMessage").style.display = "none";
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );
}
$(document).ready(function () {
    initializeForm();
    setUserCoordinates(latLong); // get user coordinates for demo
    // handle form submission
    document
        .querySelector(".form")
        .addEventListener("submit", async function (event) {
            event.preventDefault();
            $(".ui.form").form("validate form");
            // post new report
            if (form.form("is valid")) {
                let postid = uuidv4();
                let inputElem = document.getElementById("hidden-new-file");
                let file = inputElem.files[0];
                // Create new file so we can rename the file
                let blob = file.slice(0, file.size, "image/jpeg");
                let newFile = new File([blob], `${postid}_post.jpeg`, { type: "image/jpeg" });
                // Build the form data - You can add other input values to this i.e descriptions, make sure img is appended last
                let formData = new FormData();
                formData.append("hidden-new-file", newFile);
                fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                })
                    .then((res) => res.text())
                    .then(loadPosts());
                console.log('made it')

                // Loads the posts on page load
                function loadPosts() {
                    fetch("/api/upload")
                        .then((res) => res.json())
                        .then((x) => {
                            for (let y = 0; y < x[0].length; y++) {
                                console.log(x[0][y]);
                                const newimg = document.createElement("img");
                                newimg.setAttribute(
                                    "src",
                                    "https://storage.googleapis.com/dansstorage/" + x[0][y].id
                                );
                                newimg.setAttribute("width", 50);
                                newimg.setAttribute("height", 50);
                                document.getElementById("images").appendChild(newimg);
                            }
                        });
                }

























                // check for valid inputs
                const userInput = $(".form").form("get values"); // get form values

                // get person id for post request or insert new person record
                // TBD

                // insert new media record
                // TBD

                // get media id for post request
                const query = `SELECT * FROM media WHERE media_id=(SELECT max(media_id) FROM media)`;
                const mediaFetch = await fetch(`/api/custom/${query}`);
                const mediaID = await mediaFetch.json();

                await fetch("/api/reports", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        timestamp: new Date().toISOString().slice(0, 19).replace("T", " "),
                        catalog_id: userInput.plant.split(",")[1],
                        location: latLong,
                        severity_id: userInput.severityLevel,
                        // media_id: mediaID,
                        // person_id: personID,
                        comments: userInput.comments,
                    }),
                });
                resetForm();
                document.querySelector("#successMessage").style.display = "block";

                form.form('set values', {
                    firstName: userInput.firstName,
                    lastName: userInput.lastName,
                    email: userInput.email
                })

                document.querySelectorAll('.saveInput').forEach(field => {
                    field.style.opacity = .6
                })
            }
        });
});

