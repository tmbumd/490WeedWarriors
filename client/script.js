import {
    setUserCoordinates,
    initializeForm,
    resetForm,
    uuidv4,
    preserveInput,
} from "./modules.js";

const $form = $(".ui.form");

async function getMediaURL() {
    let postID = uuidv4();
    let file = document.getElementById("hidden-new-file").files[0];
    let blob = file.slice(0, file.size, "image/jpeg");
    let formData = new FormData();
    formData.append(
        "hidden-new-file",
        new File([blob], `${postID}.jpeg`, { type: "image/jpeg" })
    );
    await fetch("/upload", {
        method: "POST",
        body: formData,
    }).then((res) => res.text());
    return `https://storage.googleapis.com/weedwarriors/${postID}.jpeg`;
}

async function getMediaID() {
    const query = `SELECT media_id FROM media WHERE media_id=(SELECT max(media_id) FROM media)`;
    const mediaFetch = await fetch(`/api/custom/${query}`);
    const media = await mediaFetch.json();
    return media.length > 0 ? media[0].media_id + 1 : 1;
}

async function getUserID(userInput) {
    const query = `SELECT user_id FROM users WHERE email = '${userInput.email}'`;
    const userFetch = await fetch(`/api/custom/${query}`);
    const user = await userFetch.json();
    let userID = user.length > 0 ? user[0].user_id + 1 : -1;
    return userID;
}

async function addUser(userInput) {
    await fetch("/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            first_name: userInput.firstName,
            last_name: userInput.lastName,
            email: userInput.email,
        }),
    }).then((res) => res.text());
}

async function addMedia(mediaID, mediaURL) {
    await fetch("/api/media", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            media_id: mediaID,
            url: mediaURL,
        }),
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
            catalog_id: userInput.plant.split(",")[0],
            location: userInput.position,
            severity_id: Math.round(userInput.severity / 10),
            media_id: mediaID,
            comments: userInput.comments,
            user_id: userID,
        }),
    }).then((res) => res.text());
}

document.addEventListener("DOMContentLoaded", async () => {
    await initializeForm();
    $form.removeClass("loading");
    navigator.geolocation.watchPosition(
        setUserCoordinates,
        function (err) {
            if (err.code == 1) {
                alert("Error: Access is denied!");
            } else if (err.code == 2) {
                alert("Error: Position is unavailable!");
            }
        },
        { timeout: 5000 } // check every 5 seconds 
    );

    $form.on("submit", async function (e) {
        e.preventDefault();
        if ($form.form("is valid")) {
            document.querySelector("#submitBtn").classList.add("disabled");
            const userInput = $form.form("get values"); // get form values
            console.log(userInput);
            const mediaID = await getMediaID(); // get media id for post request
            console.log(mediaID);
            const mediaURL = await getMediaURL(); // get google cloud url
            console.log(mediaURL);
            addMedia(mediaID, mediaURL); // insert new media record
            console.log("added media");

            // let userID = await getUserID(userInput);
            // if (userID == -1) {
            //     // create user if doesn't exist
            //     addUser(userInput);
            //     userID = getUserID(userInput);
            // }

            addReport(mediaID, 1, userInput);
            resetForm();
            document.querySelector("#successMessage").style.display = "block";
            preserveInput(userInput);
        }
    });
});
