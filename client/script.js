$('.ui.dropdown')
    .dropdown(
        {
            fullTextSearch: true,
            values: [{
                "name": "Maidenhair fern [Adiantum]",
                "value": "ADIAN"
            },
            {
                "name": "False foxglove [Agalinis]",
                "value": "AGALI"
            },
            {
                "name": "Ladyfern [Athyrium]",
                "value": "ATHYR"
            }]
        });

        $( "input" ).autocomplete( "disable" );
        $("div, form, input, select, textarea").attr("autocomplete", "off");
