// Creating our initial map object

// L.map accepts 2 arguments: id of the HTML element to insert the map, and an object containing the initial options for the new map
var myMap = L.map("map", {
    center: [39.82, -98.58], // chose geo center of the US
    zoom: 5
    // layers: [myMap, ]
});


// Adding a tile layer (the background map image) to our map.
// We use the addTo method to add objects to our map
// Documentation for tileLayer:https://leafletjs.com/reference-1.6.0.html#tilelayer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 15,
    id: "dark-v10",
    accessToken: API_KEY
}).addTo(myMap);

// linking up to the USGS site
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Objective is to plot earthquakes with higher magnitudes as larger circles,
// while earthquakes with greater depth should appear darker in color.

// Function that will determine the color of the earthquake (this is example from borough example)

var depth = data.geometry.coordinates[2]



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
        case depth < 85:
            return "#FF0000";
        case depth > 100:
            return "#8B0000";
        default:
            return "black";
    }
}

// .. now need to size circles !!!


// Grabbing the GeoJSON data and adding for each earthquake 
d3.json(link).then(function (data) {
    console.log(data)

    features.forEach(function (data) {
        L.circle([data.geometry.coordinates[1], data.geometry.coordinates[0]], {
            radius: data.features.properties.mag * 10,
            color: 'black',
            fillColor: chooseColor(data.geometry.coordinates[2]),

            // if(data.geometry)

        }).bindPopup("<h1>" + feature.properties.place + "</h1> <hr> <h2>" + feature.properties.mag + "</h2>")
    }).addTo(map);







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