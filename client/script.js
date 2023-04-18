$('.ui.dropdown')
    .dropdown(
        {
            fullTextSearch: true,
            values: [{
                "name": "Jenny",
                "value": "jenny",
                "image": "/images/001.jpg",
                "imageClass": "ui mini avatar image"
            },
            {
                "name": "Avatar1",
                "value": "Avatar1",
                "image": "/images/002.jpg",
                "imageClass": "ui mini avatar image"
            },
            {
                "name": "Avatar2",
                "value": "Avatar2",
                "image": "/images/003.jpg",
                "imageClass": "ui mini avatar image"
            }]
        });

        $( "input" ).autocomplete( "disable" );
