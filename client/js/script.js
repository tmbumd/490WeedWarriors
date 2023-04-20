import {
    initializeForm, resetForm, setUserCoordinates
} from './form.js';

const form = $('.ui.form')
let latLong = ''

$(document).ready(function () {
    initializeForm()
    setUserCoordinates(latLong) // get user coordinates for demo

    // handle form submission
    document.querySelector(".form").addEventListener('submit', async function (event) {
        event.preventDefault()
        $('.ui.form').form('validate form')
        // post new report
        if (form.form("is valid")) { // check for valid inputs 
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
                    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
                    catalog_id: userInput.plant.split(",")[1],
                    location: latLong,
                    severity_id: userInput.severityLevel,
                    // media_id: mediaID,
                    // person_id: personID,
                    comments: userInput.comments
                }),
            });
            resetForm()
            document.querySelector("#successMessage").style.display = "block";
        }
    })
});