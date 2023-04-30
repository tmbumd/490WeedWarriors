<?php
// Connect to the database
$servername = "subscription-surfer-nhaya.aivencloud.com";
$username = "avnadmin";
$password = "AVNS_wbNozRCRePIYO0Z4CO8";
$dbname = "weedwarriors";

$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Retrieve data from the database
$sql = "SELECT * FROM table_name";
$result = mysqli_query($conn, $sql);

// Display the data on the front end of the application
if (mysqli_num_rows($result) > 0) {
    while($row = mysqli_fetch_assoc($result)) {
        echo "ID: " . $row["id"]. " - Name: " . $row["name"]. "<br>";
    }
} else {
    echo "0 results";
}

// Close the database connection
mysqli_close($conn);
?>