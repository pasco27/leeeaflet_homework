// Creating our initial map object

// L.map accepts 2 arguments: id of the HTML element to insert the map, and an object containing the initial options for the new map
var myMap = L.map("map", {
    center: [39.82, -98.58], // chose geo center of the US
    zoom: 11
});


// Adding a tile layer (the background map image) to our map.
// We use the addTo method to add objects to our map
// Documentation for tileLayer:https://leafletjs.com/reference-1.6.0.html#tilelayer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 8,
    id: "satellite-v11",
    accessToken: API_KEY
}).addTo(myMap);

// linking up to the USGS site
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Objective is to plot earthquakes with higher magnitudes as larger circles,
// while earthquakes with greater depth should appear darker in color.

// Function that will determine the color of the earthquake (this is example from borough example)
function chooseColor(magnitude) {
    switch (magnitude) {
        case magnitude < 1:
            return "#F5FFFA";
        case magnitude < 2:
            return "#98FB98";
        case magnitude < 3:
            return "#3CB371";
        case magnitude < 4:
            return "#FA8072";
        case magnitude < 5:
            return "#FF0000";
        case magnitude > 5:
            return "#8B0000";
        default:
            return "black";
    }
}

// .. now need to size circles 


// Grabbing the GeoJSON data and adding for each earthquake 
d3.json(link).then(function (data) {
    // Creating a geoJSON layer with the retrieved data
    L.geoJson(data, {
        // Style each feature (in this case a neighborhood)
        style: function (feature) {
            return {
                color: "white",
                // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
                fillColor: chooseColor(feature.properties.mag),
                fillOpacity: 0.5,
                weight: 1.5,
                radius: (feature.properties.mag) * 10
            };
        },

        // Called on each feature
        onEachFeature: function (feature, layer) {
            // Set mouse events to change map styling
            layer.on({
                // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
                mouseover: function (event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.9
                    });
                },
                // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                mouseout: function (event) {
                    layer = event.target;
                    layer.setStyle({
                        fillOpacity: 0.5
                    });
                },
                // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
                click: function (event) {
                    map.fitBounds(event.target.getBounds());
                }
            });
            // Giving each feature a pop-up with information pertinent to it
            layer.bindPopup("<h1>" + feature.properties.place + "</h1> <hr> <h2>" + feature.properties.mag + "</h2>");

        }
    }).addTo(map);
});
