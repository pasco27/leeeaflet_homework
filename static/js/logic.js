// Creating our initial map object
console.log(1)

// L.map accepts 2 arguments: id of the HTML element to insert the map, and an object containing the initial options for the new map
var myMap = L.map("mapid", {
    center: [39.82, -98.58], // chose geo center of the US
    zoom: 5
    // layers: [myMap, ]
});


// Adding a tile layer (the background map image) to our map.
// We use the addTo method to add objects to our map
// Documentation for tileLayer:https://leafletjs.com/reference-1.6.0.html#tilelayer
// L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 15,
//     id: "streets-v11",
//     accessToken: API_KEY
// }).addTo(myMap);


// BCS support here
var graymap = L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
        attribution:
            "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/light-v10",
        accessToken: API_KEY
    }
);
graymap.addTo(myMap);

console.log(2)

// linking up to the USGS site
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Objective is to plot earthquakes with higher magnitudes as larger circles,
// while earthquakes with greater depth should appear darker in color.

console.log(3)

// Function that will determine the color of the earthquake (this is example from borough example)

function chooseColor(depth) {
    switch (true) {
        case depth < 15:
            return "#F5FFFA";
        case depth < 30:
            return "#98FB98";
        case depth < 45:
            return "#3CB371";
        case depth < 60:
            return "#FA8072";
        case depth < 75:
            return "#FF0000";
        case depth < 90:
            return "#8B0000";
        case depth > 90:
            return "black";
        default:
            return "white";
    }
}

// .. now need to size circles !!!


// Grabbing the GeoJSON data and adding for each earthquake 
d3.json(link).then(function (data) {
    console.log(data)

    var data_features = data.features

    // var depth = data.features[0].geometry.coordinates
    // console.log(depth)

    data_features.forEach(function (data) {

        console.log(data.geometry.coordinates[1]);

        // through many hours of experimentation I found this is 1,0; not 0, 1!
        L.circle([data.geometry.coordinates[1], data.geometry.coordinates[0]], {

            radius: data.properties.mag * 30000,
            color: 'black',
            fillColor: chooseColor(data.geometry.coordinates[2]),
            fillOpacity: 0.85,
            weight: 1.5


        }).bindPopup("<h1>" + data.properties.place + "</h1> <hr> <h2>" + data.properties.mag + "</h2>")
            .addTo(myMap);

    });




    // for the legend, leaflet has custom legend control that I can play with once I get it working correctly:
    // https://leafletjs.com/examples/choropleth/

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            depthStat = [-15, 15, 30, 45, 60, 75, 90],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < depthStat.length; i++) {
            div.innerHTML +=
                '<i style="background:' + chooseColor(depthStat[i] + 1) + '"></i> ' +
                depthStat[i] + (depthStat[i + 1] ? '&ndash;' + depthStat[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);







    // this was stuff continued from borough example... 

    // Creating a geoJSON layer with the retrieved data
    // L.geoJson(data, {
    //     // Style each feature (in this case a neighborhood)
    //     style: function (feature) {
    //         return {
    //             color: "white",
    //             // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
    //             fillColor: chooseColor(feature.properties.depth),
    //             fillOpacity: 0.5,
    //             weight: 1.5,
    //             radius: (feature.properties.mag) * 10
    //         };


    //     },
    //     // Called on each feature, where to put the circles
    //     onEachFeature: function (feature, layer) {
    //         // Set mouse events to change map styling
    //         layer.on({
    //             // When a user's mouse touches an earthquake, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
    //             mouseover: function (event) {
    //                 layer = event.target;
    //                 layer.setStyle({
    //                     fillOpacity: 0.9
    //                 });
    //             },
    //             // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
    //             mouseout: function (event) {
    //                 layer = event.target;
    //                 layer.setStyle({
    //                     fillOpacity: 0.5
    //                 });
    //             },

    //         });
    //         // Giving each feature a pop-up with information pertinent to it
    //         layer.bindPopup("<h1>" + feature.properties.place + "</h1> <hr> <h2>" + feature.properties.mag + "</h2>");
    //     }
    // }).addTo(map);




});