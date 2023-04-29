import {
  setUserCoordinates,
  initializeForm,
  resetForm,
  preserveInput,
} from "./form.js";

const $form = $(".ui.form");

document.addEventListener("DOMContentLoaded", async () => {
  await initializeForm();
  $form.removeClass("loading");
  navigator.geolocation.getCurrentPosition(setUserCoordinates);
  $form.on("submit", async function (e) {
    e.preventDefault();
    if ($form.form("is valid")) {
      document.querySelector("#submitBtn").classList.add("disabled");
      const userInput = $form.form("get values"); // get form values
      const mediaID = await getMediaID(); // get media id for post request
      let userID = await getUserID(userInput); // get user id for post request
      await addReport(mediaID, userID, userInput);
      resetForm();
      document.querySelector("#successMessage").style.display = "block";
      preserveInput(userInput);
    }
  });
});

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

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
  const mediaID = media.length > 0 ? media[0].media_id + 1 : 1;
  const mediaURL = await getMediaURL();

  await fetch("/api/media", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      media_id: mediaID,
      url: mediaURL,
    }),
  })
    .then((res) => res.json())
    .then((json) => console.log(json));

  return mediaID;
}

async function getUserID(userInput) {
  const query = `SELECT user_id FROM users WHERE email = '${userInput.email}' AND first_name = '${userInput.first_name}' AND last_name = '${userInput.last_name}'`;
  const userFetch = await fetch(`/api/custom/${query}`);
  let user = await userFetch.json();
  let userID;

  if (user.length > 0) {
    userID = user[0].user_id;
  } else {
    const usersFetch = await fetch("api/users");
    const users = await usersFetch.json();
    userID = users.data ? users.data.length + 1 : 1;
    await addUser(userID, userInput);
  }
  return userID;
}

async function addUser(userID, userInput) {
  await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userID,
      first_name: userInput.first_name,
      last_name: userInput.last_name,
      email: userInput.email,
    }),
  })
    .then((res) => res.json())
    .then((json) => console.log(json));
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
  })
    .then((res) => res.json())
    .then((json) => console.log(json));
}
