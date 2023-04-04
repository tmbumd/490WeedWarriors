document.addEventListener('DOMContentLoaded', function() {
    const elems = document.querySelectorAll('select');
    let instances = M.FormSelect.init(elems);


    const plantImageContainer = document.querySelector('#plant-img')
    const selectedPlant = document.querySelector('#plant-select')
    selectedPlant.addEventListener('change', function() {
        plantImageContainer.src = `images/${selectedPlant.value}.jpg`
        console.log(`images/${selectedPlant.value}.jpg`)
    })

    const coordinates = document.querySelector('#coordinates')
    navigator.geolocation.getCurrentPosition(function(position) {
        coordinates.value = `[${position.coords.latitude}, ${position.coords.longitude}]`
        // console.log(`[${position.coords.latitude}, ${position.coords.longitude}]`)
    })


  });


