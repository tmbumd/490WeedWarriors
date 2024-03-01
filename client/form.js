/*Form Data Initialization:
- The form.js file initializes form data and sets up event listeners for form elements.
- It handles retrieving catalog data, restoring user information, and setting up dropdowns and form fields.

User Input Handling:
- The file includes functions for preserving, restoring, and clearing user input.
- It uses local storage to store and retrieve user input data.

Form Reset Function:
- The resetForm function clears the form, resets input fields, and retrieves user coordinates.
- It also handles clearing saved user information and controlling form elements.

File Upload Handling:
- Listeners are set up to handle file uploads and display the file path.
- The form.js file includes functions for handling file uploads and showing the file path.

Geolocation Handling:
- The initializeForm function includes code to retrieve user coordinates and set the position value in the form.
- It uses the setUserCoordinates function to set the user's geolocation.

Local Storage Usage:
- The file uses local storage to persist user input data and retrieve it when needed.
- It saves and restores user information using the localStorage object.

Form Field Validation:
- The form.js file defines form field validations and required fields.
- It ensures that certain fields are not empty and validates email input. */
function setUserCoordinates(position) {
  document.querySelector(
    "#position"
  ).value = `[${position.coords.latitude}, ${position.coords.longitude}]`;
}

async function initializeForm() {
  // create lists of values for dropdowns
  let catalogData = JSON.parse(sessionStorage.getItem("catalogData"));
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
    sessionStorage.setItem("catalogData", JSON.stringify(catalogData));
  }

  restoreInput(); // restore user information if exists

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
  
  // listen for file upload to show path
  const fileUploadPath = document.querySelector("#uploadedFilePath");
  document.querySelector("#hidden-new-file").addEventListener("change", () => {
    fileUploadPath.innerHTML = $(".form")
      .form("get value", "file")
      .replace("C:\\fakepath\\", "");
  });
}

function resetForm() {
  $(".ui.form").form("clear");
  navigator.geolocation.getCurrentPosition(setUserCoordinates);
  document.querySelector("#uploadedFilePath").innerHTML = "";
  document.querySelector("#successMessage").style.display = "none";
  document.querySelector("#submitBtn").classList.remove("disabled");
}

function preserveInput(userInput) {
  localStorage.setItem("email", JSON.stringify(userInput.email));
  localStorage.setItem("first_name", JSON.stringify(userInput.first_name));
  localStorage.setItem("last_name", JSON.stringify(userInput.last_name));
  restoreInput();
  navigator.geolocation.getCurrentPosition(setUserCoordinates);
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
      field.classList.add("disabled");
    });
    document.querySelector("#clearUserInfoBtn").style.display = "block";
    document
      .querySelector("#clearUserInfoBtn")
      .addEventListener("click", (e) => {
        clearInput();
      });
  }
}

function clearInput() {
  document.querySelector("#clearUserInfoBtn").style.display = "none";
  localStorage.clear();
  resetForm();
  document.querySelectorAll(".saveInput").forEach((field) => {
    field.classList.remove("disabled");
  });
}

export { setUserCoordinates, initializeForm, resetForm, preserveInput };
